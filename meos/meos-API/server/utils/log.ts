export async function logToDiscord(type: string, context: { title: string, message: any }[]): Promise<void> {
  const logwebhook = 'https://discord.com/api/webhooks/1349719066255949897/HYGwEqcaantfR_6xb5WgbpdaowJaD3vRLWV3aGoKuTe8EHjT792HISJWGdabTnJo5WeW';
  const webhooks = {
    tebex: 'https://discord.com/api/webhooks/1349719066255949897/HYGwEqcaantfR_6xb5WgbpdaowJaD3vRLWV3aGoKuTe8EHjT792HISJWGdabTnJo5WeW',
    default: 'https://discord.com/api/webhooks/1349731124116455466/KlmnWPIP3qotzjRMALrMCG7qAEzCIEaPRLmXxAUMRg-2E_kH3Z_rh_DhccxHpiLfR4r8',
  }
  const message = `A new log from the api`;
  const embeds = [
    {
      color: 0xFF700,
      timeStamp: new Date(),
      title: 'Log',
      fields: [

      ]
    }
  ]

  context.forEach((c) => {
    embeds[0].fields.push({
      name: c.title,
      value: c.message,
    });
  });

  const webhook = webhooks[type] || webhooks.default;
  await fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: message,
      embeds
    })
  });
}