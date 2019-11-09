import { Request, Response } from 'express';
const { Sequelize, QueryTypes } = require('sequelize');
//import db from '../config/sagesse_database';

//const db = new Sequelize('postgres://consultation:adobe29;borines@sagesse.polytech.umontpellier.fr:5432/sagesse20&ssl=true');
const db = new Sequelize('sagesse20', 'consultation', 'adobe29;borines', {host: 'sagesse.polytech.umontpellier.fr',
                                                                          port: 5432,
                                                                          dialect: 'postgres',
                                                                          native: true,
                                                                          quoteIdentifiers: true,
                                                                        });


export const testConnexion = async () => {
  console.log("BEGIN authentification");
  db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return 'SUCCES';
  })
  .catch((error: any)=>{
    console.log('Connexion FAILED : '+error);
  })
};



export const getFormationDetails = async (nomFormation : string) => {
  console.log("BEGIN of get formation")

  let formationInfo = await db.query('SELECT * \
                                       FROM sagesse.parcours p\
                                       WHERE p."codParcours" = :codP ; '
                                      , { replacements: {codP:nomFormation},
                                          type: QueryTypes.SELECT});
    let formationDetails = {
      "id": formationInfo[0].idParcours ,
      "code": formationInfo[0].codParcours,
      "title": formationInfo[0].licParcours,
      "description":formationInfo[0].descParcours,
      "steps": [] as any
    };

  let steps = await db.query('SELECT * \
                                 FROM sagesse.elps p\
                                 WHERE p."idParcours" = :idP \
                                 AND p."natElp"= :etape ; '
                                , {replacements: {idP:formationDetails.id ,etape:"étape"},
                                   type: QueryTypes.SELECT});

  steps.forEach((step: any) => {
    let stepInfo = {
      "id": step.idElp ,
      "code": step.codElp,
      "title": step.licElp,
      "credit": step.nbCrdElp
    };
    formationDetails.steps.push(stepInfo);
  });

  return formationDetails;
};




export const getStepDetails = async (idStep : number) => {
  console.log("BEGIN get step "+idStep);

  let stepValues = await db.query( 'SELECT * \
                                    FROM syllabus.syl_elps s \
                                    WHERE s."idElp" = :idStep ; '
                                    ,{replacements: {idStep:idStep},
                                      type: QueryTypes.SELECT });

  let stepDetails = {
    "id": stepValues[0].idElp ,
    "title": stepValues[0].licElp,
    "description": stepValues[0].descriptionElp,
    "context":  stepValues[0].contexteElp,
    "content":  stepValues[0].contenuElp,
    "periods":[] as any
  };

  let periods = await db.query('SELECT *   \
                                FROM sagesse.elps e \
                                WHERE e."natElp" = :type \
                                  AND e."idElp" IN (SELECT DISTINCT f."idPeriode" \
                                                  FROM sagesse.flat_elps f \
                                                  WHERE f."idEtape" = :idStep ) ; '
                                ,{replacements: {idStep:idStep, type:"période"},
                                  type: QueryTypes.SELECT });

  periods.forEach((period: any) => {
    stepDetails.periods.push({
      "id": period.idElp ,
      "code": period.codElp,
      "title": period.licElp,
      "credit": period.nbCrdElp
    });
  });

  return stepDetails;
};










export const getPeriodDetails = async (idPeriod: number) => {
  console.log("BEGIN get period "+idPeriod);

  let periodValues = await db.query( 'SELECT * \
                                    FROM syllabus.syl_elps s \
                                    WHERE s."idElp" = :id ; '
                                    ,{replacements: {id:idPeriod},
                                      type: QueryTypes.SELECT });

  let periodDetails = {
    "id": periodValues[0].idElp ,
    "title": periodValues[0].licElp,
    "description": periodValues[0].descriptionElp,
    "context":  periodValues[0].contexteElp,
    "content":  periodValues[0].contenuElp,
    "modules":[] as any
  };

  let modules = await db.query('SELECT *   \
                                FROM sagesse.elps e \
                                WHERE e."natElp" = :type \
                                  AND e."idElp" IN (SELECT DISTINCT f."idModule" \
                                                  FROM sagesse.flat_elps f \
                                                  WHERE f."idPeriode" = :id ) ; '
                                ,{replacements: {id:idPeriod, type:"module"},
                                  type: QueryTypes.SELECT });

  modules.forEach((module: any) => {
    periodDetails.modules.push({
      "id": module.idElp ,
      "code": module.codElp,
      "title": module.licElp,
      "credit": module.nbCrdElp
    });
  });
  return periodDetails;
};







export const getModuleDetails = async (idModule: number) => {
  console.log("BEGIN get step "+idModule);

  let moduleValues = await db.query( 'SELECT * \
                                    FROM syllabus.syl_elps s \
                                    WHERE s."idElp" = :id ; '
                                    ,{replacements: {id:idModule},
                                      type: QueryTypes.SELECT });

  let moduleDetails = {
    "id": moduleValues[0].idElp ,
    "title": moduleValues[0].licElp,
    "description": moduleValues[0].descriptionElp,
    "context":  moduleValues[0].contexteElp,
    "content":  moduleValues[0].contenuElp,
    "subjects":[] as any
  };

  let subjects = await db.query('SELECT *   \
                                FROM sagesse.elps e \
                                WHERE e."natElp" = :type \
                                  AND e."idElp" IN (SELECT DISTINCT f."idMatiere" \
                                                  FROM sagesse.flat_elps f \
                                                  WHERE f."idModule" = :id ) ; '
                                ,{replacements: {id:idModule, type:"matière"},
                                  type: QueryTypes.SELECT });

  subjects.forEach((subject: any) => {
    moduleDetails.subjects.push({
      "id": subject.idElp ,
      "code": subject.codElp ,
      "title": subject.licElp ,
      "credit": subject.nbCrdElp
    });
  });
  return moduleDetails;
};







export const getSubjectDetails = async (idSubject: number) => {
  console.log("BEGIN get step "+idSubject);

  let subjectValues = await db.query('SELECT * \
                                      FROM syllabus.syl_elps s \
                                      WHERE s."idElp" = :id ; '
                                      ,{replacements: {id:idSubject},
                                        type: QueryTypes.SELECT });

  let subjectDetails = {
    "id": subjectValues[0].idElp ,
    "title": subjectValues[0].licElp,
    "description": subjectValues[0].descriptionElp,
    "context":  subjectValues[0].contexteElp,
    "content":  subjectValues[0].contenuElp
  };

  return subjectDetails;
};