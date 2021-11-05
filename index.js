const { default: axios } = require("axios");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/", async (req, res) => {
  const { apiKey } = req.query;
  const { contact_id, city } = req.body;

  try {
    const contact = await contactExists(apiKey, contact_id);
    if (contact) {
      try {
        const contactWithTag = await addTag(
          apiKey,
          city,
          contact.tags,
          contact.id
        );
        return res.json(contactWithTag);
      } catch (error) {
        console.log(error.message);
        return res.json(error);
      }
    }
    return res.json(contact);
  } catch (error) {
    console.log(error.message);
    return res.json({ res: "hello" });
  }
});

async function contactExists(apiKey, contactId) {
  try {
    const response = await axios({
      url: `https://rest.gohighlevel.com/v1/contacts/${contactId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const { contact } = response.data;

    console.log("CONTACT: ", contact);
    console.log("RESPONSE: ", response.data);
    return contact;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw error.message;
  }
}

async function addTag(apiKey, city, tags, contactId) {
  try {
    const response = await axios({
      url: `https://rest.gohighlevel.com/v1/contacts/${contactId}`,
      method: "PUT",
      data: {
        tags: [...tags, city],
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const { contact } = response.data;

    console.log("CONTACT: ", contact);
    console.log("RESPONSE: ", response.data);
    return contact;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw error.message;
  }
}

app.listen(PORT, () => console.log("Backend Running on port: " + PORT));
