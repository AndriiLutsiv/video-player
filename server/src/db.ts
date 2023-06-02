import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const query = (text: string, params: any[]) => pool.query(text, params);

export const getClientInfoByUuid = async (uuid: string) => {
  const result = await query('SELECT * FROM video_data WHERE uuid = $1', [uuid]);
  if (result.rowCount === 0) {
    throw new Error('No record found with the provided UUID');
  }

  const companyID = result.rows[0].company_id;
  const logoResult = await query('SELECT logo_url FROM client_info WHERE uuid = $1', [companyID]);

  return {
    ...result.rows[0],
    logo_url: logoResult.rows[0]?.logo_url,
  };
};

export const updatePlayedStatus = (uuid: string) =>
  query('UPDATE video_data SET played = true WHERE uuid = $1', [uuid]);

export const updateCtaClickedStatus = (uuid: string) =>
  query('UPDATE video_data SET cta_clicked = true WHERE uuid = $1', [uuid]);