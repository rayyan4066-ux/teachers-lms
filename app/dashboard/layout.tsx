import Shell from '@/components/Shell';import {currentUser} from '@/lib/auth';
export default async function Layout({children}:{children:React.ReactNode}){const {profile}=await currentUser();return <Shell role={profile.role} name={profile.full_name}>{children}</Shell>}
