export interface InscriptionDebatInput {
  nom_prenom: string;
  genre: string;
  organisation: string;
  fonction: string;
  type_participant: string;
  ville_pays: string;
  telephone: string;
  email: string;
  organe_presse?: string;
  participer_cif: string; // 'oui' | 'non'
}

export interface InscriptionCifInput {
  nom_prenom: string;
  genre: string;
  tranche_age: string;
  ville_pays: string;
  statut: string;
  etablissement: string;
  whatsapp: string;
  email: string;
  association: string;
  attente?: string;
  moyen_deplacement: string;
  date_arrivee: string;
  date_depart: string;
  comment_connu: string;
}

export interface InscriptionDelegueInput {
  structure_pays: string;
  mandat: string;
  nom_prenom: string;
  fonction: string;
  telephone: string;
  email: string;
  nombre_delegues: number;
  besoin_hebergement: string; // 'oui' | 'non'
  moyen_deplacement: string;
  date_arrivee: string;
  date_depart: string;
  code_validation: string;
}
