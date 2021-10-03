export default {
  data: () => ({
    // { key: ['Error message of key'] }, Can not be null.
    apiRules: {},
    apiErrorMsg: '',
  }),

  methods: {
    apiRuleClear(field) {
      const rules = { ...this.apiRules };
      const nestedKey = field.split('.');
      if (nestedKey.length === 1) {
        if (rules[field]) {
          delete rules[field];
          this.apiRules = rules;
        }
      } else if (nestedKey.length > 1) {
        // TODO find nested item and remove that properly
        this.apiRules = delete rules[nestedKey[0]];

        // TBD - Dot notation to Object.
        // let directory = {};
        // Object.keys(fileData).forEach((key) => {
        //   const divided = key.split('.');
        //   const value = fileData[key];
        //
        //   /**
        //    tempObject: Base object for creating a new structure.
        //    container: The property for keep digging into the nested object of tempObject.
        //    It can't be fetching from directory property directly because it needs to initialize
        //    */
        //   let tempObject = {...directory};
        //   let container = tempObject;
        //   divided.forEach((key, index, values) => {
        //     if (container[key] === undefined) {
        //       container = (container[key] = (index === values.length - 1 ? value : {}))
        //     } else {
        //       container = (container[key] =
        //       (index === values.length - 1 ? value : container[key]))
        //     }
        //   });
        //   directory = tempObject;
        // });
      }
    },

    isErrorMatchingField(standardForm) {
      let flag = false;
      const errorKeys = Object.keys(this.apiRules) || [];

      // Check error field and input field are matching
      if (Array.isArray(standardForm)) {
        standardForm.forEach((key) => {
          if (errorKeys.includes(key)) {
            flag = true;
          }
        });
      } else if (standardForm && Object.entries(standardForm).length > 0) {
        Object.keys(standardForm).forEach((key) => {
          if (errorKeys.includes(key)) {
            flag = true;
          }
        });
      }
      console.log('flag?', flag);

      // If field doesn't match, make error message.
      if (!flag && errorKeys.length > 0) {
        errorKeys.forEach((key, index) => {
          this.apiErrorMsg += `${key.replace('_', ' ')}: ${this.apiRules[key]
            ? this.apiRules[key].join(', ') : 'Validation error'}`;
          if (index < errorKeys.length - 1) {
            this.apiErrorMsg += '\n';
          }
        });
      } else {
        this.apiErrorMsg = 'Field validation error';
      }
      return flag;
    },
  },
};
