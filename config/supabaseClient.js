const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

const supabase = createClient(API_URL, API_KEY, {
  db: { schema: "treino-facil" }
});

module.exports = supabase;