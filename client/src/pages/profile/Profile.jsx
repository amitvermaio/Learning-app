import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncloaduser } from '../../store/actions/authActions';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileInfo from '../../components/profile/ProfileInfo';
import ChangePasswordForm from '../../components/profile/ChangePasswordForm';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(asyncloaduser());
  }, [dispatch]);

  if (status === 'loading' && !user) return <Spinner />;

  return (
    <div className='max-w-2xl mx-auto space-y-4'>
      <PageHeader title='My profile' />
      <ProfileHeader user={user} />
      <ProfileInfo user={user} />
      {/* Only show change password for local accounts */}
      {user?.provider === 'local' && <ChangePasswordForm />}
    </div>
  );
};

export default Profile;