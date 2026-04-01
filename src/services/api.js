import { supabase } from './supabase';

// SALES
export const getSales = async (month, year) => {
  // Fetch all sales and we will filter them in the UI for 100% Reliability
  return await supabase
    .from('sales')
    .select('*, team_members(name)')
    .order('date', { ascending: false });
};

export const addSale = async (data) => supabase.from('sales').insert(data);
export const updateSale = async (id, data) => supabase.from('sales').update(data).eq('id', id);
export const deleteSale = async (id) => supabase.from('sales').delete().eq('id', id);
export const updateSaleStatus = async (id, status) => supabase.from('sales').update({ status }).eq('id', id);

// TEAM
export const getTeamMembers = async () => supabase.from('team_members').select('*');
export const addTeamMember = async (data) => supabase.from('team_members').insert(data);
export const updateTeamMember = async (id, data) => supabase.from('team_members').update(data).eq('id', id);
export const deleteTeamMember = async (id) => supabase.from('team_members').delete().eq('id', id);
export const updateMemberSalary = async (id, salary) => supabase.from('team_members').update({ salary_pkr: salary }).eq('id', id);

// SCREENSHOTS
export const uploadScreenshot = async (file, saleId) => {
  const path = `${saleId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from('screenshots').upload(path, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('screenshots').getPublicUrl(data.path);
  return publicUrl;
};

// ANALYTICS (RPC calls)
export const getMonthlySummary = async (month, year) => supabase.rpc('get_monthly_summary', { target_month: month, target_year: year });
export const getMemberStats = async (month, year) => supabase.rpc('get_member_stats', { target_month: month, target_year: year });
export const getYearlyTrend = async (year) => supabase.rpc('get_yearly_trend', { target_year: year });

// AUTH
export const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
export const signOut = () => supabase.auth.signOut();
export const getCurrentUser = () => supabase.auth.getUser();
