<template>
  <v-main id="passwordPage">
    <div id="passwordBackground"></div>

    <v-app-bar
      flat
      height="110"
      color="transparent"
      style="position: absolute; top: 0; left: 0; width: 100%;"
    >
      <v-toolbar-title
        style="cursor: pointer"
        :style="{
          width: $vuetify.breakpoint.smAndDown ? '95px' : '130px',
        }"
        class="ml-0"
        :class="$vuetify.breakpoint.smAndDown ? 'px-0' : 'px-4'"
      >
        <div>
          <v-img
            src="@/assets/branding/gcg_logo.png"
            contain
            height="30"
          />
        </div>
      </v-toolbar-title>

      <v-spacer />

      <div class="hidden-sm-and-down px-4">
        <v-img
          src="@/assets/branding/gcg_slogan.png"
          contain
          width="160"
        />
      </div>
    </v-app-bar>

    <v-container
      class="py-0 px-4 fill-height"
      style="height: 100%; min-height: 100vh;"
      fluid
    >
      <v-card
        id="passwordCard"
        class="elevation-20 mx-auto"
        width="400"
      >
        <v-card-text class="mb-6">
          <div class="font-weight-bold mb-7">
            GLA360 Report
          </div>

          <v-form
            ref="passwordForm"
            v-model="validate"
            @submit.prevent="submit()"
          >
            <v-text-field
              v-model="form.password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              :rules="apiRules.password || rules.password"
              @change="apiRuleClear('password')"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            dark
            color="primary lighten-1"
            block
            :loading="loading"
            @click="submit()"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import glaApi from '@/api/gla/report';
import apiRules from '@/mixins/apiRules';

export default {
  name: 'Password',

  mixins: [
    apiRules,
  ],

  props: {
    publicReportData: {
      type: Object,
      default: null,
    },

    publicPassword: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    form: {
      password: '',
    },
    validate: true,
    rules: {
      password: [
        (v) => !!v || 'Password required',
      ],
    },
    loading: false,
  }),

  methods: {
    async submit() {
      if (this.$refs.passwordForm.validate()) {
        try {
          this.loading = true;
          const { id } = this.$route.params;
          const { password } = this.form;
          const data = await glaApi.getPublicReport(id, password, this.selfGla);

          this.$emit('update:publicReportData', data);
          this.$emit('update:publicPassword', password);
        } catch (err) {
          if (err.field) {
            this.apiRules = err.field;
            if (!this.isErrorMatchingField(this.form)) {
              this.$toast.error(this.apiErrorMsg);
            }
          } else {
            this.$toast.error(err.msg);
          }
        } finally {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#passwordBackground {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at bottom right, #010f27, #003865);
  background-size: cover;
  background-attachment: fixed;
}

#passwordPage {
  min-height: 100%;
}
</style>
