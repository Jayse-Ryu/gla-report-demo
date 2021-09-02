export default {
  data: () => ({
    mixColorSet: {
      assure_success: '#AEB8FE',
      boundaryless_inclusion: '#C92A00',
      continuous_change: '#FFBC42',
      communication: '#57A773',
      engaging_people: '#4059AD',
    },

    clusters: [
      'assure_success',
      'continuous_change',
      'engaging_people',
      'boundaryless_inclusion',
      'communication',
      'verbatim',
    ],

    competencies: [
      'dev_tech_savvy',
      'ensure_cs',
      'maintain_ca',
      'achieving_pm',
      'anticipate_opp',
      'leading_change',
      'dev_ppl',
      'build_partner',
      'share_leadership',
      'empower_ppl',
      'think_global',
      'appreciate_diversity',
      'demonstrate_integrity',
      'encourage_cd',
      'create_sv',
    ],

    mapStructure: {
      assure_success: ['dev_tech_savvy', 'ensure_cs', 'maintain_ca'],
      continuous_change: ['achieving_pm', 'anticipate_opp', 'leading_change'],
      engaging_people: ['dev_ppl', 'build_partner', 'share_leadership'],
      boundaryless_inclusion: ['empower_ppl', 'think_global', 'appreciate_diversity'],
      communication: ['demonstrate_integrity', 'encourage_cd', 'create_sv'],
    },

    surveyStructure: [
      {
        cluster: 'assure_success',
        competencies: [
          {
            competency: 'dev_tech_savvy',
            questions: ['1', '2', '3'],
          },
          {
            competency: 'ensure_cs',
            questions: ['4', '5', '6', '7', '8'],
          },
          {
            competency: 'maintain_ca',
            questions: ['9', '10', '11', '12', '13'],
          },
        ],
      },

      {
        cluster: 'continuous_change',
        competencies: [
          {
            competency: 'achieving_pm',
            questions: ['14', '15', '16', '17', '18'],
          },
          {
            competency: 'anticipate_opp',
            questions: ['19', '20', '21', '22'],
          },
          {
            competency: 'leading_change',
            questions: ['23', '24', '25', '26', '27'],
          },
        ],
      },

      {
        cluster: 'engaging_people',
        competencies: [
          {
            competency: 'dev_ppl',
            questions: ['28', '29', '30', '31', '32', '33'],
          },
          {
            competency: 'build_partner',
            questions: ['34', '35', '36', '37', '38', '39'],
          },
          {
            competency: 'share_leadership',
            questions: ['40', '41', '42', '43'],
          },
        ],
      },

      {
        cluster: 'boundaryless_inclusion',
        competencies: [
          {
            competency: 'empower_ppl',
            questions: ['44', '45', '46', '47'],
          },
          {
            competency: 'think_global',
            questions: ['48', '49', '50', '51', '52'],
          },
          {
            competency: 'appreciate_diversity',
            questions: ['53', '54', '55', '56', '57'],
          },
        ],
      },

      {
        cluster: 'communication',
        competencies: [
          {
            competency: 'demonstrate_integrity',
            questions: ['58', '59', '60', '61', '62'],
          },
          {
            competency: 'encourage_cd',
            questions: ['63', '64', '65', '66', '67'],
          },
          {
            competency: 'create_sv',
            questions: ['68', '69', '70', '71', '72'],
          },
        ],
      },

      {
        cluster: 'verbatim',
        questions: ['1', '2', '3'],
      },
    ],
  }),
};
