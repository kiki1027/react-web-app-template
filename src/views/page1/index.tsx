import { useAuth } from '@components/app/provider';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';

const Page1 = () => {
  const auth = useAuth();
  const history = useHistory();
  return (
    <div style={{ padding: 20 }}>
      <h1>这里是 FM77.7 {auth?.user?.name}的深夜电台</h1>
      <Button
        type="ghost"
        onClick={() => {
          auth.signOut().then(() => {
            history.push('/login');
          });
        }}
      >
        下一个频道
      </Button>
    </div>
  );
};

export default Page1;
