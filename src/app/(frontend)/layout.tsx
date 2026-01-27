import { FrontendLayoutClient } from './FrontendLayoutClient'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <FrontendLayoutClient>{children}</FrontendLayoutClient>
}
