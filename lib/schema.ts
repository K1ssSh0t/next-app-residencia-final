import * as categoriasGenerales from "@/schema/categorias-generales";
import * as carreraInstitucions from "@/schema/carrera-institucions";
import * as municipios from "@/schema/municipios";
import * as regions from "@/schema/regions";
import * as modalidads from "@/schema/modalidads";
import * as helpers from "@/schema/helpers";
import * as preguntas from "@/schema/preguntas";
import * as cuestionarios from "@/schema/cuestionarios";
import * as instituciones from "@/schema/instituciones";
import * as tipoInstituciones from "@/schema/tipo-instituciones";
import * as tipoBachilleres from "@/schema/tipo-bachilleres";
import * as categoriaPersonas from "@/schema/categoria-personas";
import * as carreras from "@/schema/carreras";
import * as users from "@/schema/users";
import * as authTables from "@/schema/auth-tables";

export const schema = {
  ...categoriasGenerales,
  ...carreraInstitucions,
  ...municipios,
  ...regions,
  ...modalidads,
  ...helpers,
  ...preguntas,
  ...cuestionarios,
  ...instituciones,
  ...tipoInstituciones,
  ...tipoBachilleres,
  ...categoriaPersonas,
  ...carreras,
  ...users,
  ...authTables,
}