export class companyhierachical {
  idCargo: number = -1;
  idEmpresa: number = -1;
  IdNivelJerarquia: number = -1;
  Nivel: number = -1;
  IdCargoMT: number = -1;
  CargoMT: string = "";
  PlazasFijas: number = -1;
  PlazasTemporales: number = -1;
  Cargo: string = "";
  IndCargoSupervisorio: boolean = false;
  UsuarioCrea: string = "";
  UsuarioModifica: string = "";
  cargoshijos: companyhierachical[]
} 
