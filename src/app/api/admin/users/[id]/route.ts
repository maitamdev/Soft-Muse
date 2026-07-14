import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const updateSchema = z.object({
 nameAr: z.string().trim().min(2).max(120).optional(), username: z.string().trim().min(2).max(50).optional(),
 email: z.string().email().optional(), phone: z.string().nullable().optional(), password: z.string().min(8).max(128).optional(),
 role: z.enum(['admin', 'manager', 'editor']).optional(), status: z.enum(['active', 'inactive']).optional(),
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

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
 const auth = await authorizeAdmin();
 if ('error' in auth) return auth.error;
 const { id } = await context.params;
 const parsed = updateSchema.safeParse(await request.json());
 if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' }, { status: 400 });
 const input = parsed.data;
 if (id === auth.user.id && (input.status === 'inactive' || (input.role && input.role !== 'admin'))) {
  return NextResponse.json({ error: 'Bạn không thể tự khóa hoặc hạ quyền tài khoản đang đăng nhập.' }, { status: 400 });
 }
 const authUpdates: Record<string, unknown> = {};
 if (input.email) authUpdates.email = input.email.toLowerCase();
 if (input.password) authUpdates.password = input.password;
 if (input.nameAr) authUpdates.user_metadata = { full_name: input.nameAr };
 if (input.status) authUpdates.ban_duration = input.status === 'inactive' ? '876000h' : 'none';
 if (Object.keys(authUpdates).length) {
  const { error } = await auth.admin.auth.admin.updateUserById(id, authUpdates);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
 }
 const profile = Object.fromEntries(Object.entries({ full_name: input.nameAr, username: input.username,
  email: input.email?.toLowerCase(), phone: input.phone, role: input.role, avatar_url: input.avatarUrl,
  is_active: input.status ? input.status === 'active' : undefined }).filter(([, value]) => value !== undefined));
 if (Object.keys(profile).length) {
  const { error } = await auth.admin.from('profiles').update(profile).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
 }
 return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
 const auth = await authorizeAdmin();
 if ('error' in auth) return auth.error;
 const { id } = await context.params;
 if (id === auth.user.id) return NextResponse.json({ error: 'Bạn không thể xóa tài khoản đang đăng nhập.' }, { status: 400 });
 const { data: target } = await auth.admin.from('profiles').select('role').eq('id', id).maybeSingle();
 if (target?.role === 'admin') {
  const { count } = await auth.admin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin').eq('is_active', true);
  if ((count ?? 0) <= 1) return NextResponse.json({ error: 'Hệ thống phải còn ít nhất một quản trị viên hoạt động.' }, { status: 400 });
 }
 const { error } = await auth.admin.auth.admin.deleteUser(id);
 if (error) return NextResponse.json({ error: error.message }, { status: 400 });
 return NextResponse.json({ ok: true });
}

