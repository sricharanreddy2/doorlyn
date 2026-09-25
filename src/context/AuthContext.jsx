import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext();

const DEFAULT_DEMO_USER = {
  id: 'demo-user-123',
  name: 'Rajesh Kumar',
  phone: '+91 9876543210',
  email: 'rajesh@doorlyn.in',
  isPhoneVerified: true,
  isEmailVerified: true,
  address: 'Flat 402, Lotus Heights, Hitech City, Hyderabad - 500081',
  walletBalance: 450,
  referralCode: 'DOORLYN-HERO-98'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(DEFAULT_DEMO_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Fetch or create profile from Supabase Database
  const fetchSupabaseProfile = useCallback(async (sessionUser) => {
    if (!supabase || !sessionUser) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Supabase profile fetch error:', error.message);
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name || sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'Doorlyn User',
          phone: data.phone || sessionUser.user_metadata?.phone || '',
          email: data.email || sessionUser.email || '',
          isPhoneVerified: Boolean(data.is_phone_verified),
          isEmailVerified: Boolean(data.is_email_verified || sessionUser.email_confirmed_at),
          address: data.address || '',
          walletBalance: parseFloat(data.wallet_balance ?? 200),
          referralCode: data.referral_code || 'DOORLYN-PRO'
        });
      } else {
        // Build initial profile record if not auto-created by trigger yet
        const defaultName = sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'Doorlyn User';
        const defaultPhone = sessionUser.user_metadata?.phone || '';
        const initialProfile = {
          id: sessionUser.id,
          name: defaultName,
          email: sessionUser.email || '',
          phone: defaultPhone,
          address: 'Doorlyn Customer Address',
          wallet_balance: 200,
          referral_code: 'DOORLYN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          is_phone_verified: Boolean(defaultPhone && defaultPhone.length >= 10),
          is_email_verified: Boolean(sessionUser.email_confirmed_at)
        };

        const { error: upsertErr } = await supabase
          .from('profiles')
          .upsert(initialProfile);

        if (upsertErr) {
          console.warn('Profile upsert notice:', upsertErr.message);
        }

        setUser({
          id: sessionUser.id,
          name: initialProfile.name,
          phone: initialProfile.phone,
          email: initialProfile.email,
          isPhoneVerified: initialProfile.is_phone_verified,
          isEmailVerified: initialProfile.is_email_verified,
          address: initialProfile.address,
          walletBalance: initialProfile.wallet_balance,
          referralCode: initialProfile.referral_code
        });
      }
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error in fetchSupabaseProfile:', err);
    }
  }, []);

  // Initialize Supabase session listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user && mounted) {
          await fetchSupabaseProfile(session.user);
        } else if (mounted) {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.warn('Supabase initial auth check:', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        await fetchSupabaseProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser({
          id: '',
          name: '',
          phone: '',
          email: '',
          isPhoneVerified: false,
          isEmailVerified: false,
          address: '',
          walletBalance: 0,
          referralCode: ''
        });
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchSupabaseProfile]);

  // Login handler
  const login = async (identifier, password) => {
    setAuthError(null);
    const cleanId = (identifier || '').trim();
    const isEmail = cleanId.includes('@');
    const isPhone = !isEmail && /^\+?[0-9\s-]{7,15}$/.test(cleanId);

    if (isSupabaseConfigured && supabase) {
      try {
        const emailToUse = isEmail ? cleanId : `${cleanId.replace(/[^0-9]/g, '')}@doorlyn.app`;
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailToUse,
          password: password || 'doorlyn123'
        });

        if (error) {
          setAuthError(error.message);
          return { success: false, error: error.message };
        }

        if (data?.user) {
          await fetchSupabaseProfile(data.user);
        }
        return { success: true };
      } catch (err) {
        setAuthError(err.message);
        return { success: false, error: err.message };
      }
    }

    // Fallback demo mode
    const userName = isEmail
      ? cleanId.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      : isPhone ? `User ${cleanId.slice(-4)}` : 'Doorlyn User';

    setUser({
      id: 'demo-user-123',
      name: userName,
      phone: isPhone ? cleanId : '',
      email: isEmail ? cleanId : '',
      isPhoneVerified: isPhone,
      isEmailVerified: isEmail,
      address: 'Flat 402, Lotus Heights, Hitech City, Hyderabad - 500081',
      walletBalance: 450,
      referralCode: 'DOORLYN-HERO-98'
    });
    setIsAuthenticated(true);
    return { success: true };
  };

  // Register handler
  const register = async (identifier, password, fullName) => {
    setAuthError(null);
    const cleanId = (identifier || '').trim();
    const isEmail = cleanId.includes('@');
    const isPhone = !isEmail && /^\+?[0-9\s-]{7,15}$/.test(cleanId);
    const emailToUse = isEmail ? cleanId : `${cleanId.replace(/[^0-9]/g, '')}@doorlyn.app`;
    const userName = fullName && fullName.trim()
      ? fullName.trim()
      : isEmail
        ? cleanId.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : isPhone ? `User ${cleanId.slice(-4)}` : 'New Doorlyn Member';

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: emailToUse,
          password: password || 'doorlyn123',
          options: {
            data: {
              full_name: userName,
              phone: isPhone ? cleanId : ''
            }
          }
        });

        if (error) {
          setAuthError(error.message);
          return { success: false, error: error.message };
        }

        if (data?.user) {
          await fetchSupabaseProfile(data.user);
        }
        return { success: true, user: data?.user };
      } catch (err) {
        setAuthError(err.message);
        return { success: false, error: err.message };
      }
    }

    // Fallback demo mode
    setUser({
      id: 'demo-user-' + Date.now(),
      name: userName,
      phone: isPhone ? cleanId : '',
      email: isEmail ? cleanId : '',
      isPhoneVerified: isPhone,
      isEmailVerified: isEmail,
      address: 'Village Green, Sector 4, Doorlyn Hub, Hyderabad',
      walletBalance: 200,
      referralCode: 'DOORLYN-NEW-100'
    });
    setIsAuthenticated(true);
    return { success: true };
  };

  // Logout handler
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut notice:', err.message);
      }
    }
    setIsAuthenticated(false);
    setUser({
      id: '',
      name: '',
      phone: '',
      email: '',
      isPhoneVerified: false,
      isEmailVerified: false,
      address: '',
      walletBalance: 0,
      referralCode: ''
    });
  };

  // Update wallet handler
  const updateWallet = async (amount) => {
    const newBalance = Math.max(0, (user?.walletBalance || 0) + amount);
    setUser(prev => ({ ...prev, walletBalance: newBalance }));

    if (isSupabaseConfigured && supabase && user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({ wallet_balance: newBalance })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Could not sync wallet balance with Supabase:', err.message);
      }
    }
  };

  // Update profile details handler
  const updateUser = async (updatedFields) => {
    const nextUser = { ...user, ...updatedFields };
    if (updatedFields.phone !== undefined) {
      nextUser.isPhoneVerified = Boolean(updatedFields.phone && updatedFields.phone.trim().length >= 10);
    }
    if (updatedFields.email !== undefined) {
      nextUser.isEmailVerified = Boolean(updatedFields.email && updatedFields.email.includes('@'));
    }
    setUser(nextUser);

    if (isSupabaseConfigured && supabase && user?.id) {
      try {
        const payload = {};
        if (updatedFields.name !== undefined) payload.name = updatedFields.name;
        if (updatedFields.phone !== undefined) payload.phone = updatedFields.phone;
        if (updatedFields.email !== undefined) payload.email = updatedFields.email;
        if (updatedFields.address !== undefined) payload.address = updatedFields.address;
        if (updatedFields.walletBalance !== undefined) payload.wallet_balance = updatedFields.walletBalance;

        await supabase
          .from('profiles')
          .update(payload)
          .eq('id', user.id);
      } catch (err) {
        console.warn('Could not sync updated fields with Supabase:', err.message);
      }
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        loading, 
        authError,
        isSupabaseReady: isSupabaseConfigured,
        login, 
        register, 
        logout, 
        updateWallet, 
        updateUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
