import { getCollection, type CollectionEntry } from 'astro:content';

export type ProgramGirdisi = CollectionEntry<'programlar'>;
export type YasCatisi = ProgramGirdisi['data']['yerlesim'][number]['yasCatisi'];

/** Bir yaş çatısındaki programları, o çatıya ait sıraya göre döndürür (§07, §13). */
export async function catidakiProgramlar(cati: YasCatisi): Promise<ProgramGirdisi[]> {
  const hepsi = await getCollection('programlar');
  return hepsi
    .filter((p) => p.data.yerlesim.some((y) => y.yasCatisi === cati))
    .sort((a, b) => siraFor(a, cati) - siraFor(b, cati));
}

export function siraFor(program: ProgramGirdisi, cati: YasCatisi): number {
  return program.data.yerlesim.find((y) => y.yasCatisi === cati)?.sira ?? 999;
}

/** Ana sayfada adıyla görünmesi gereken amiral programlar (§04). */
export async function amiralProgramlar(): Promise<ProgramGirdisi[]> {
  const hepsi = await getCollection('programlar');
  const catiSirasi: YasCatisi[] = ['okul-oncesi', 'cocuklar', 'gencler', 'yetiskinler'];
  return hepsi
    .filter((p) => p.data.anaSayfaGorunurluk === 'amiral')
    .sort(
      (a, b) =>
        catiSirasi.indexOf(a.data.yerlesim[0]!.yasCatisi) -
        catiSirasi.indexOf(b.data.yerlesim[0]!.yasCatisi)
    );
}

/** Bir şubede gösterilecek programlar — §20'deki envanterin karşılığı. */
export async function subedekiProgramlar(sube: 'gaziantep' | 'izmir') {
  const hepsi = await getCollection('programlar');
  const catiSirasi: YasCatisi[] = ['okul-oncesi', 'cocuklar', 'gencler', 'yetiskinler'];
  return hepsi
    .filter((p) =>
      p.data.teklifler.some((t) => t.sube === sube && t.durum !== 'bu-subede-acik-degil')
    )
    .sort((a, b) => {
      const ac = a.data.yerlesim[0]!;
      const bc = b.data.yerlesim[0]!;
      const fark = catiSirasi.indexOf(ac.yasCatisi) - catiSirasi.indexOf(bc.yasCatisi);
      return fark !== 0 ? fark : ac.sira - bc.sira;
    });
}

export function programYolu(id: string): string {
  return `/programlar/${id}`;
}

export function durumlar(program: ProgramGirdisi) {
  return program.data.teklifler.map((t) => t.durum);
}
