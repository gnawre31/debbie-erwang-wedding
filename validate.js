const validateData = (data) => {
  try {
    if (data.first_name.length == 0) return false;
    if (data.last_name.length == 0) return false;
    if (data.email.length == 0) return false;
    if (data.email.length > 0 && invalidEmail(data.email)) return false;
    if (data.rsvp == null) return false;
  } catch (error) {
    console.log("error");
    return false;
  }

  return true;
};

const invalidEmail = (emailField) => {
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(emailField)) return false;
  return true;
};

module.exports = { validateData };
