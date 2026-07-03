import type { H3Event } from 'h3'

export const requireAdminUser = async (event: H3Event) => {
  const accessToken = getCookie(event, 'sb-access-token')

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    })
  }

  const supabase = createSupabaseAdminClient()
  const { data: userResult, error: userError } = await supabase.auth.getUser(accessToken)

  if (userError || !userResult.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid session',
    })
  }

  const { data: profile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('user_id, role')
    .eq('user_id', userResult.user.id)
    .eq('role', 'admin')
    .maybeSingle()

  if (profileError || !profile) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required',
    })
  }

  return userResult.user
}
