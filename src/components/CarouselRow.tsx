import { PosterCard, type PosterCardItem } from "@/components/PosterCard";

export function CarouselRow({
  id,
  title,
  subtitle,
  items,
  ranked,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  items: PosterCardItem[];
  ranked?: boolean;
}) {
  return (
    <section id={id} className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-white/55">{subtitle}</p>}
        </div>
        <div className="hidden text-[11px] text-white/45 sm:block">Swipe / scroll →</div>
      </div>

      <div className="mt-4 overflow-x-auto pb-2">
        <div className="flex gap-4">
          {items.map((item, idx) => (
            <PosterCard key={item.imdbId} item={item} rank={ranked ? idx + 1 : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}

