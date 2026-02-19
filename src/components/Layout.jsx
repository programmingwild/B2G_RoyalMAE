import NavBar from './NavBar';
import Toast from './Toast';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Animated background blobs */}
      <div className="blob w-72 h-72 bg-primary-200 top-[-5rem] left-[-3rem] animate-float-slow" />
      <div className="blob w-60 h-60 bg-warm-200 top-[20rem] right-[-4rem] animate-float-slower" />
      <div className="blob w-48 h-48 bg-violet-200 bottom-[10rem] left-[-2rem] animate-float" />

      <Toast />
      <main className="flex-1 pb-24 max-w-lg mx-auto w-full px-4 pt-6 relative z-10">
        {children}
      </main>
      <NavBar />
    </div>
  );
}
