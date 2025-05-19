import { meosPool } from './db';

export async function addToHistory(serverId: string, type: string, title: any, desc: any) {
  const [serverhistory] = await meosPool.query('SELECT * FROM serverhistory WHERE belongsToServer = ?', [serverId]);

  const historyData = serverhistory[0];

  const historyItem = {
    type: type,
    title: title,
    description: desc,
  }

  if (!historyData) {
    const newHistory = {
      belongsToServer: serverId,
      history: [
        JSON.stringify(historyItem)
      ]
    }

    await meosPool.query('INSERT INTO serverhistory SET ?', [newHistory]);
  } else {
    if (historyData.history.some((item: any) => item.title === title && item.description === desc)) {
      return;
    }
    historyData.history.push(historyItem);
    if (historyData.history.length >= 3) {
      historyData.history = historyData.history.slice(-3);
    }

    await meosPool.query('UPDATE serverhistory SET ? WHERE belongsToServer = ?', [historyData, serverId]);
  }
}