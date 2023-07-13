const getProfile = async (req, res, next) => {
  const { Profile } = req.app.get('models');

  const profile = await Profile.findOne({
    where: { id: req.get('profile_id') || 0 },
  });

  if (!profile) return res.status(401).end();

  req.profile = profile;
  req.profileType = `${profile.type
    .charAt(0)
    .toUpperCase()}${profile.type.slice(1)}`;
  req.profileTypeKey = `${req.profileType}Id`;

  next();
};

module.exports = { getProfile };
