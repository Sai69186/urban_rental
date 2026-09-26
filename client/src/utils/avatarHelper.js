// Natural, realistic, diverse professional human portraits (natural lighting, authentic corporate & lifestyle)
const REALISTIC_PORTRAITS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb', // legacy flag to replace
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', // Man in casual button-down
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', // Woman in corporate blazer
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', // Man in natural outdoor daylight
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80', // Woman smiling natural portrait
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80', // Professional executive man
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', // Creative professional woman
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80', // Business director man
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80', // Tech consultant woman
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', // Young architect man
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', // Smiling woman headshot
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80', // Corporate manager man
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', // Young data scientist woman
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80', // Software engineer man
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80', // Senior advisor woman
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', // Casual tech lead man
];

const VALID_NATURAL_PORTRAITS = REALISTIC_PORTRAITS.slice(1);

export const getRealisticAvatar = (user) => {
  if (!user) return VALID_NATURAL_PORTRAITS[0];

  const currentImg = user.profileImage || '';

  // If user has a valid custom image that is NOT the old purple-lit default
  if (
    currentImg &&
    !currentImg.includes('photo-1534528741775-53994a69daeb') &&
    currentImg.startsWith('http')
  ) {
    return currentImg;
  }

  // Generate deterministic index based on user name or ID
  const str = (user.name || user.email || user._id || 'user').toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % VALID_NATURAL_PORTRAITS.length;
  return VALID_NATURAL_PORTRAITS[index];
};

export default getRealisticAvatar;
