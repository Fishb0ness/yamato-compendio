## CORE_DEFINITIONS

- DADO_MORFICO:
  - TYPE: d10
  - RANGE: 1-10
  - PIFIA: 1
  - CRITICO: 10
- CAPS:
  - DEFINITION: moneda de activación para Edictos y otros efectos
  - PRETOR_MONTHLY_BASE: 10000 por Pretor
  - PRETOR_RESET: día 1 de cada mes
- VIDAS:
  - DEFINITION: salud de la barra de vidas
- CARGAS:
  - ESCUDO: cargas de escudo/escudo de energía
  - DOCTRINAS: cargas mensuales de uso para Custodios

## GLOBAL_STATE_RULES

- ARTEFACTOS:
  - COUNT: 3 tipos (Vida, Tiempo, Muerte)
  - LIST_COMMAND: escribir `artefactos` en chat para ver disponibles
  - EFFECT_SOURCE: efectos dependientes de DADO_MORFICO
  - FRAGILITY: manipulación frágil, puede destruirse por tirada
  - UNLOCK_PATHS:
    - completar objetivos/misiones en directo
    - PRETOR.EDICTO_DEL_AVATAR.ABSOLUTO desbloquea artefacto
- ARTEFACTO_VIDA:
  - BASE_EFFECT: +1 carga de Escudo y +1 Vida
  - USAGE_CONSTRAINT: no usable al morir
  - ROLL_EFFECTS:
    - PIFIA: destruye este artefacto; no aplica efecto base
    - CRITICO: +1 carga de Escudo y +1 Vida adicionales
- ARTEFACTO_TIEMPO:
  - BASE_EFFECT: genera Ampliable de 10 horas (próximo fin de semana)
  - ROLL_EFFECTS:
    - PIFIA: destruye este artefacto; no aplica efecto base
    - CRITICO: +2 horas
- ARTEFACTO_MUERTE:
  - BASE_EFFECT: impide muerte permanente de 1 módulo/juego al perder todas las vidas
  - USAGE_CONSTRAINT: usable tras la muerte
  - ROLL_EFFECTS:
    - PIFIA: destruye todos los artefactos y anula todos sus efectos
    - CRITICO: +3 cargas de Escudo
- SOBRE_CARGA_SISTEMA_EDICTOS:
  - TRIGGER_A: 3 Edictos Normales seguidos
  - TRIGGER_B: 1 Edicto Absoluto
  - EFFECT: todos los Edictos pasan a coste x2
  - APPLIES_TO: activaciones posteriores, incluyendo parry de edictos
- EDICTOS_COSTE_BASE:
  - NORMAL: 1000 Caps
  - ABSOLUTO: 6000 Caps

## ROLE_REGISTRY: CUSTODIO

- ENTITY: Custodio
- CAPABILITIES_SUMMARY: ejecuta 4 Doctrinas con cargas mensuales limitadas
- DOCTRINA_CHARGES_MONTHLY:
  - DOCTRINA_DE_LA_SANGRE: 1
  - DOCTRINA_DE_LA_VOLUNTAD: 1
  - DOCTRINA_DEL_CAMINO: 3
  - DOCTRINA_DE_HIERRO: 3
- DOCTRINA_DE_LA_SANGRE:
  - COST: 1 carga mensual
  - EFFECT: cancela un Edicto, Alteración o uso de artefacto en curso
  - TRIGGERS: contrarresta efectos en curso
  - ENABLES: destrucción del objetivo cancelado
- DOCTRINA_DE_LA_VOLUNTAD:
  - COST: 1 carga mensual
  - ENABLES: activar un Edicto Absoluto
- DOCTRINA_DEL_CAMINO:
  - COST: 3 cargas mensuales
  - ENABLES: crear misión artefacto
  - DEPENDENCY_CHAIN:
    - REQUIRES: misión artefacto creada
    - REQUIRES: un V completa la misión
    - REQUIRES: artefacto hallado
    - ENABLES: Custodio activa un artefacto inmediatamente
- DOCTRINA_DE_HIERRO:
  - COST: 3 cargas mensuales
  - TARGET: 1 de los 9 Pretores
  - REQUIRES: tirada de DADO_MORFICO
  - CAPS_RECHARGE_BY_ROLL:
    - PIFIA: +0 Caps
    - 2_TO_9: +1000 Caps
    - CRITICO: +2000 Caps
  - ENABLES:
    - uso temporal por Custodio de 1 Edicto del Pretor objetivo (NO Absoluto)
    - Pretor objetivo no actúa contra el Custodio mientras se respeta Doctrina de Hierro

## ROLE_REGISTRY: PRETOR

- ENTITY: Pretor
- PRETOR_COUNT: 9
- RESOURCE_MODEL:
  - CAPS_MONTHLY: 10000 por Pretor
  - CAPS_RESET: día 1 de cada mes
- EDICT_ACTIVATION_MODES:
  - NORMAL: 1000 Caps (aplica SOBRE_CARGA_SISTEMA_EDICTOS si existe)
  - ABSOLUTO: 6000 Caps (aplica SOBRE_CARGA_SISTEMA_EDICTOS si existe)
- PARRY_DE_EDICTOS:
  - TRIGGER: un Pretor activa el mismo Edicto después de otro Pretor
  - EFFECT: impone su decisión sobre el Pretor anterior
  - LIMIT: repetible mientras haya Caps acumuladas
  - REQUIRES: considerar coste x2 si hay sobrecarga

- EDICTO_DE_LA_VOZ:
  - NORMAL:
    - EFFECT: impone resultado definitivo de una votación
  - ABSOLUTO:
    - EFFECT: crea misión prioritaria en directo para desbloquear artefacto
    - REQUIRES: detallar misión posible en juego activo
    - INPUT_SOURCE: ideas por chat o Discord
    - TRIGGERS: si misión completada, Pretor recupera +3000 Caps

- EDICTO_DE_LA_SANGRE:
  - EFFECT_CLASS: transfiere Caps a barra de vidas
  - NORMAL:
    - EFFECT: +1 Escudo
  - ABSOLUTO:
    - EFFECT: +3 Vidas

- EDICTO_DE_LA_ALTERACION:
  - NORMAL:
    - EFFECT: relanza dado y anula resultado anterior
  - ABSOLUTO:
    - EFFECT: crea modificador del dado en módulo activo
  - MODIFICADOR_DEL_DADO_RULESET:
    - PIFIA: -2 Vidas
    - 2_TO_5: -1 Vida
    - 6_TO_9: +1 Vida
    - CRITICO: +2 Vidas

- EDICTO_DEL_AVATAR:
  - NORMAL:
    - EFFECT_A: activa 1 artefacto disponible elegido por el Pretor
    - EFFECT_B: impone presencia como avatar in-game (si juego lo permite)
  - ABSOLUTO:
    - EFFECT: desbloquea 1 artefacto
  - EXTRA_ROLL_WHEN_PRETOR_ACTIVATES_ARTEFACT:
    - PIFIA: -2000 Caps
    - CRITICO: +3000 Caps

- EDICTO_DEL_JUICIO:
  - NORMAL:
    - EFFECT: genera Juicio contra 1 usuario del chat
    - JUDGMENT_FLOW:
      - chat visible para evaluar con emotes/palabras
      - resultado ENJUICIAR: +1 Vida
      - resultado PERDONAR: +1 Escudo
  - ABSOLUTO:
    - EFFECT: genera Juicio Mórfico contra versión activa de Yirak
    - REQUIRES: tirada de DADO_MORFICO
    - ROLL_RESULTS:
      - PIFIA: -3000 Caps
      - 2_TO_5: gana Yirak; Pretor no puede usar Edictos ese día
      - 6_TO_9: Pretor gana +3000 Caps; se pierden todas las Vidas y Escudos
      - CRITICO: +10000 Caps; Caps sobrantes distribuibles al resto de Pretores

## INTERACTION_TABLE

- INTERACTION: Custodio.Doctrina_de_la_Sangre -> cancela acción en curso
  - TARGETS: Edicto | Alteración | uso de artefacto
  - RESPONSE: efectos del objetivo se contrarrestan y el objetivo se destruye
- INTERACTION: Custodio.Doctrina_de_la_Voluntad -> habilita Edicto Absoluto
  - TARGETS: capacidades de Edicto
  - RESPONSE: se permite activación en modo Absoluto
- INTERACTION: Custodio.Doctrina_del_Camino -> misión artefacto -> activación inmediata
  - TARGETS: pipeline de desbloqueo/uso de artefacto
  - RESPONSE: tras completar cadena de dependencias, Custodio activa artefacto inmediatamente
- INTERACTION: Custodio.Doctrina_de_Hierro -> refuerzo de Pretor
  - TARGETS: Caps del Pretor objetivo y uso temporal de Edicto no absoluto
  - RESPONSE: Custodio usa temporalmente 1 Edicto no absoluto; Pretor objetivo no actúa contra Custodio
- INTERACTION: Pretor A vs Pretor B (Parry de Edictos)
  - TRIGGER: Pretor B activa mismo Edicto después de Pretor A
  - RESPONSE: Pretor B impone decisión; repetible con Caps suficientes
- INTERACTION: Pretor activa artefacto por Edicto del Avatar (Normal)
  - TRIGGER: activación de artefacto por Pretor
  - RESPONSE: tirada extra con penalización/bonificación de Caps (Pifia -2000, Crítico +3000)

## EXTERNAL_INFLUENCES

- DONATIONS:
  - ALTERACION_MIN_DONATION: 5€
  - ALTERACION_PER_USER_LIMIT: cada usuario puede activar cada Alteración 1 vez por directo
  - DURING_AMPLIABLE_SINGLE_DONATION_EFFECTS:
    - suma tiempo al contador
    - suma a barra de sangre si permamuerte está activa
    - si donación >= 5€, permite elegir y activar Alteración
- AMPLIABLES:
  - DURATION_RANGE: 10 a 12 horas máximo
  - COUNTER_INCREASE_SOURCE: donaciones
  - UI: tiempo restante visible arriba a la derecha
- ALTERACIONES:
  - ACCESS: cualquier usuario con donación válida puede activar Alteraciones
  - COMMON_RULE: son tiradas de dado para alterar el stream
  - PIFIA_NOTE: la pifia puede generar consecuencias impredecibles
  - ALTERACION_MORFICA:
    - EFFECT: relanza dado anulando lanzamiento previo
  - ALTERACION_TEMPORAL:
    - REQUIRES: resultado de dado >= 7
    - EFFECT: activa Ampliable de 10 horas el siguiente fin de semana
  - ALTERACION_SANGUINEA:
    - REQUIRES: resultado de dado >= 7
    - EFFECT: activa 1 carga de escudo de energía
  - ALTERACION_DE_INTERFAZ:
    - REQUIRES: resultado de dado >= 7
    - EFFECT: aumenta checkpoint +1 hora
  - ALTERACION_DE_ARTEFACTO:
    - REQUIRES: resultado de dado >= 7
    - EFFECT: activa 1 artefacto
