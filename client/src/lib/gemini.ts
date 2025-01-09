const GEMINI_API_KEY = 'AIzaSyAzotkOX2e4GScxh8BzhDvnCsv1Stz2gLg';

export async function generateSQLQuery(prompt: string, tableSchema: { tableName: string; columns: string }): Promise<string> {
  const { tableName, columns } = tableSchema;

  try {
    console.log("ttttt",tableName);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
       
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Given these columns in table '${tableName}': ${columns}

Generate a DuckDB SQL query for: ${prompt}

Return only the SQL query, nothing else. For prompt like top 15 data or top 5 data dont use where clause and order by just give upper x rows where x is asked by the user,
 To correctly reference the column with a space in its name, you need to enclose it within square brackets ''. This tells SQL that the entire text within the brackets represents a single column name, even if it contains spaces`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
            topK: 1,
            topP: 1,
            maxOutputTokens: 100,
          },
        }),
      }
    );

    if (!response.ok) throw new Error('Failed to generate query');

    const data = await response.json();
    
    let sqlQuery = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!sqlQuery) throw new Error('Invalid response from API');

    sqlQuery = sqlQuery.replace(/```sql/g, '').replace(/```/g, '').trim();
    console.log(sqlQuery);
    return sqlQuery;
   
  } catch (error) {
    console.log("hii");
    throw new Error('Failed to generate query: ');
  }
}
