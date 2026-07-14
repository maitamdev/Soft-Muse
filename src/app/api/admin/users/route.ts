import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const createSchema = z.object({
 nameAr: z.string().trim().min(2).max(120), username: z.string().trim().min(2).max(50),
 email: z.string().email(), phone: z.string().nullable().optional(), password: z.string().min(8).max(128),
 role: z.enum(['admin', 'manager', 'editor']), status: z.enum(['active', 'inactive']).default('active'),
 avatarUrl: z.string().url().nullable().optional(),
});

async function authorizeAdmin() {
 const session = await createServerClient();
 const { data: { user } } = await session.auth.getUser();
 if (!user) return { error: NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 }) };
 const { data: profile } = await session.from('profiles').select('role,is_active').eq('id', user.id).maybeSingle();
 if (!profile?.is_active || profile.role !== 'admin') return { error: NextResponse.json({ error: 'Chỉ quản trị viên được quản lý nhân viên.' }, { status: 403 }) };
 return { user, admin: createAdminClient() };
}

export async function GET() {
 const auth = await authorizeAdmin();
 if ('error' in auth) return auth.error;
 const [{ data: authData, error: authError }, { data: profiles, error: profileError }] = await Promise.all([
  auth.admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  auth.admin.from('profiles').select('*').in('role', ['admin', 'manager', 'editor']).order('created_at', { ascending: false }),
 ]);
 if (authError || profileError) return NextResponse.json({ error: authError?.message ?? profileError?.message }, { status: 500 });
 const usersById = new Map(authData.users.map((user) => [user.id, user]));
 const result = (profiles ?? []).map((profile) => {
  const authUser = usersById.get(profile.id);
  return { id: profile.id, nameAr: profile.full_name, username: profile.username ?? authUser?.email?.split('@')[0] ?? '',
   email: profile.email ?? authUser?.email ?? '', phone: profile.phone, role: profile.role, avatarUrl: profile.avatar_url,
   lastLoginAt: profile.last_login_at ?? authUser?.last_sign_in_at ?? null, loginCount: profile.login_count ?? 0,
   status: profile.is_active ? 'active' : 'inactive', createdAt: profile.created_at };
 });
 return NextResponse.json(result);
}

export async function POST(request: Request) {
 const auth = await authorizeAdmin();
 if ('error' in auth) return auth.error;
 const parsed = createSchema.safeParse(await request.json());
 if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' }, { status: 400 });
 const input = parsed.data;
 const { data, error } = await auth.admin.auth.admin.createUser({
  email: input.email.toLowerCase(), password: input.password, email_confirm: true,
  user_metadata: { full_name: input.nameAr }, ban_duration: input.status === 'inactive' ? '876000h' : 'none',
 });
 if (error || !data.user) return NextResponse.json({ error: error?.message ?? 'Không thể tạo tài khoản.' }, { status: 400 });
 const { error: profileError } = await auth.admin.from('profiles').update({ full_name: input.nameAr,
  username: input.username, email: input.email.toLowerCase(), phone: input.phone ?? null, role: input.role,
  avatar_url: input.avatarUrl ?? null, is_active: input.status === 'active' }).eq('id', data.user.id);
 if (profileError) {
  await auth.admin.auth.admin.deleteUser(data.user.id);
  return NextResponse.json({ error: profileError.message }, { status: 400 });
 }
 return NextResponse.json({ id: data.user.id }, { status: 201 });
}

