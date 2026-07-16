// Layout des pages d'authentification : aucun header/footer,
// écran plein pour concentrer l'utilisateur sur le formulaire.
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div id="main-content" className="min-h-dvh">{children}</div>;
}
