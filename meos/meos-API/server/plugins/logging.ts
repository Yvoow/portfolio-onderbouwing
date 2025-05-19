import { authenticate } from '../utils/auth';

export default defineNitroPlugin((nitro) => {
  const webhooks = {
    error: 'https://discord.com/api/webhooks/1347524080248815718/2ZNfLSn2UH5mR_alD5leGteMYQvr8ljpC4ef0PqUG8laZwDJMESVgIhLO3E1BXiMhujE',
    warn: '',
    info: '',
    debug: '',
  }
  nitro.hooks.hook('error', async (error, { event }) => {
    const user = await authenticate(event);
    const message = `A new error occured: ${error.message}`;
    const embeds = [
      {
        color: 0xFF700,
        timeStamp: new Date(),
        title: 'Details',
        fields: [
          {name: 'Path', value: event.path},
          {name: 'Message', value: `A new error occured: ${error.message}`},
          {name: 'User', value: user ? user.username : 'Unknown'},
          {name: 'Server', value: user ? user.belongsToServer : 'Unknown'},
          {name: 'Role', value: user ? user.role : 'Unknown'},
          {name: 'Role Icon', value: user ? user.roleicon : 'Unknown'},
          {name: 'Server Admin', value: user ? user.serverAdmin : 'Unknown'},
          {name: 'MEOS Admin', value: user ? user.meosAdmin : 'Unknown'},
          {name: 'Call Sign', value: user ? user.callsign : 'Unknown'},
          {name: 'Specializations', value: user ? user.specializations : 'Unknown'},
          {name: 'GPS', value: user ? user.GPS : 'Unknown'},
        ]
      }
    ]

    await fetch(webhooks.error, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: message,
        embeds: user ? embeds : []
      })
    });
  });
});