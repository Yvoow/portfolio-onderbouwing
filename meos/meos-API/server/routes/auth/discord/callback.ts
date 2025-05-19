const clientId = process.env.DISCORD_CLIENT_ID
const clientSecret = process.env.DISCORD_CLIENT_SECRET
const redirectUri = process.env.DISCORD_REDIRECT_URI

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event)
  if (!code) {
    event.node.res.statusCode = 400
    return { error: 'No code provided' }
  }

  try {
    const tokenResponse = await fetch(`https://discord.com/api/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: String(code),
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    const tokenData = await tokenResponse.json()
    if (!tokenData.token_type || !tokenData.access_token) {
      event.node.res.statusCode = 400
      return { error: 'Failed to authenticate with Discord' }
    }

    const { token_type, access_token } = tokenData

    const userResponse = await fetch(`https://discord.com/api/users/@me`, {
      headers: {
        Authorization: `${token_type} ${access_token}`
      }
    })

    const userData = await userResponse.json()
    
    return {
      success: true,
      user: userData
    }
  } catch (error) {
    console.error('Error during Discord authentication:', error)
    event.node.res.statusCode = 500
    return { error: 'Failed to authenticate with Discord' }
  }
})
