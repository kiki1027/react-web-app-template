import Loadable from 'react-loadable';
import { LoadingComponent } from '@components';

const CustomLoadable = ({ loader, loading = LoadingComponent }) => {
  return Loadable({ loader, loading });
};

export default CustomLoadable;
