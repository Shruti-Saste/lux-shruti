export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-ivory">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-12">
        <div>
          <p className="font-serif text-2xl">LUXÉRIA</p>
          <p className="text-xs text-muted-foreground mt-3 max-w-xs">
            Maison de Couture established 1923. Hand-finished in Florence, Paris, Lyon and La Chaux-de-Fonds.
          </p>
        </div>
        <div>
          <p className="hairline mb-4">Maison</p>
          <ul className="space-y-2 text-sm">
            <li>Our Story</li><li>Ateliers</li><li>Sustainability</li><li>Press</li>
          </ul>
        </div>
        <div>
          <p className="hairline mb-4">Client Services</p>
          <ul className="space-y-2 text-sm">
            <li>Shipping & Returns</li><li>Care Guide</li><li>Made to Order</li><li>Private Appointments</li>
          </ul>
        </div>
        <div>
          <p className="hairline mb-4">Correspondence</p>
          <p className="text-sm text-muted-foreground">
            Receive seasonal lookbooks and private invitations.
          </p>
          <div className="mt-3 flex border-b border-onyx">
            <input placeholder="Your email" className="flex-1 bg-transparent py-2 text-sm outline-none" />
            <button className="hairline gold-underline">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} Luxéria SA · Place Vendôme, Paris
      </div>
    </footer>
  );
}
