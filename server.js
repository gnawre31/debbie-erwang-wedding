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

// Function to check if email exists in the Notion database
const emailExistsInDatabase = async (email) => {
  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        filter: {
          property: "email",
          email: { equals: email },
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

    return response.data.results.length > 0;
  } catch (error) {
    console.error("Error checking email in Notion:", error);
    return false;
  }
};

// Submit route
app.post("/submit", async (req, res) => {
  const data = req.body;
  const valid = validateData(data);

  if (!valid) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const submission_id =
    data.first_name[0] + data.last_name[0] + Date.now().toString();

  try {
    const emailExists = await emailExistsInDatabase(data.email);
    const submissionType = emailExists ? "edit" : "new";

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
          additional_notes: {
            rich_text: [{ text: { content: data.additional_notes } }],
          },
          submission_type: {
            select: { name: submissionType },
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
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
