import sql from "mssql";

const dbSettings = {
  user: "sa",
  password: "41798105",
  server: "localhost",
  database: "usersdb",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.log("Error: ", error);
  }
};
