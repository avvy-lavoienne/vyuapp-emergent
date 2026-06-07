import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Login' };

export default function LoginPage({ searchParams }) {
  return <LoginForm next={searchParams?.next || '/admin'} />;
}
