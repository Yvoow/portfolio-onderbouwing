import { meosPool } from "~/utils/db";

export default defineEventHandler(async (event) => {
  const [rows] = await meosPool.query(`
    SELECT 
      c.*,
      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', cp.id,
            'text', cp.text,
            'type', cp.type
          )
        ), '[]'
      ) AS points
    FROM changelogs c
    LEFT JOIN changelog_points cp ON c.id = cp.changelog_id
    GROUP BY c.id
    ORDER BY c.id DESC
  `);
  
  
  const changelogs = rows.map(row => ({
    ...row,
    points: JSON.parse(row.points)
  }));
  return changelogs;
});
