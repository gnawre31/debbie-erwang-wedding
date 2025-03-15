const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

const { validateData } = require("./validate");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.DATABASE_ID;

app.post("/submit", async (req, res) => {
  const data = req.body;

  const valid = validateData(data);

  if (valid) {
    const submission_id =
      data.first_name[0] + data.last_name[0] + Date.now().toString();

    try {
      const notionResponse = await axios.post(
        "https://api.notion.com/v1/pages",
        {
          parent: { database_id: DATABASE_ID },
          properties: {
            first_name: {
              rich_text: [{ text: { content: data.first_name } }],
            },
            last_name: {
              rich_text: [{ text: { content: data.last_name } }],
            },
            email: { email: data.email },
            rsvp: { checkbox: data.rsvp },
            food_preference: {
              rich_text: [{ text: { content: data.food_preference } }],
            },
            additional_guests: {
              rich_text: [{ text: { content: data.additional_guests } }],
            },
            additional_notes: {
              rich_text: [{ text: { content: data.additional_notes } }],
            },
            submission_type: {
              select: { name: "new" },
            },
            submission_id: {
              title: [{ text: { content: submission_id } }],
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${NOTION_API_KEY}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
          },
        }
      );
      res.json(notionResponse.data);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  } else res.status(500).json({ error: "invalid data" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
