export interface UploadCvResponse {
  filename: string;
  size: number;
  type: string;
  content: string;
  response: {
    Nome: string;
    Email: string;
    Telefone: string;
    Linkedin: string;
    Github: string;
    Resumo: string;
    Skills: string[];
    Experiencias: {
      Cargo: string;
      Empresa: string;
      DataInicio: string;
      DataFim: string;
      Descricao: string;
    }[];
    Educacao: {
      Curso: string;
      Instituicao: string;
      DataInicio: string;
      DataFim: string;
    }[];
  };
}

export interface GeneratedCvItem {
  UserId: string;
  JobId: string;
  Title: string;
  FileName: string;
  ExtractedText: string;
}

export interface GeneratedCvListResponse {
  message: string;
  data: GeneratedCvItem[];
}
