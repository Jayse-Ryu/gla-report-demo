<template>
  <v-dialog
    id="shareDialog"
    v-model="showLocal"
    max-width="700"
  >
    <v-card>
      <v-card-title class="font-weight-bold">
        {{ $t('share.title') }}
      </v-card-title>

      <v-card-text>
        <div class="mb-2">
          1. {{ $t('share.setPassword') }}

          <v-switch
            v-if="isSuperUser"
            v-model="isPasswordProtected"
            :label="$t('share.isPwProtected')"
            inset
            @change="setPublicStatus"
          />
        </div>

        <div class="mb-5">
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-row align="center">
              <v-col
                cols="12"
                md="4"
                class="px-5"
              >
                <v-text-field
                  v-model="password"
                  :disabled="!isPublic && !isPasswordProtected"
                  :label="$t('common.password')"
                  :rules="passwordRules"
                  type="password"
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
                class="px-5"
              >
                <v-text-field
                  v-model="passwordConfirm"
                  :disabled="!isPublic && !isPasswordProtected"
                  :rules="passwordConfirmRules"
                  :label="$t('common.confirmPassword')"
                  type="password"
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
                class="text-right pl-5"
              >
                <v-btn
                  rounded
                  outlined
                  color="primary lighten-2"
                  :loading="loading"
                  @click="clickSavePassword"
                >
                  {{ $t('common.save') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </div>

        <v-row class="mb-5">
          <v-col
            cols="12"
            sm="6"
            class="d-flex justify-space-between align-center"
          >
            <span>2. {{ $t('share.turnShareLink') }}</span>

            <v-switch
              ref="publicSwitch"
              v-model="isPublic"
              inset
              @click="clickPublicSwitch"
            />
          </v-col>

          <v-col
            cols="12"
            sm="6"
            class="d-flex justify-space-between align-center"
          >
            <span>3. {{ $t('share.copyShareLink') }}</span>

            <v-btn
              rounded
              color="primary lighten-2"
              :disabled="!isPublic"
              @click="copyToClipboard"
            >
              {{ $t('common.copyLink') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import dialog from '@/mixins/dialog';
import glaApi from '@/api/gla/report';

export default {
  name: 'ShareDialog',

  mixins: [
    dialog,
  ],

  props: {
    selfGla: {
      type: Boolean,
      default: false,
    },

    report: {
      type: Object,
      default: null,
    },
  },

  data() {
    const that = this;
    return {
      valid: false,
      isPublic: false,
      isPasswordProtected: true,
      password: '',
      passwordConfirm: '',
      passwordRules: [
        (value) => ((!this.isPublic && !value) || (!!value))
          || that.$t('common.rules.reqPw'),
      ],
      passwordConfirmRules: [
        (value) => ((!this.isPublic && !value) || (!!value))
          || that.$t('common.rules.reqConfirmPw'),
        (value) => value === this.password || that.$t('common.rules.matchConfirmPw'),
      ],
      loading: false,
    };
  },

  computed: {
    ...mapGetters('account', {
      isSuperUser: 'isSuperUser',
    }),

    publicUrl() {
      let url = '';
      if (this.selfGla) {
        url = this.$router.resolve({
          name: 'publicSLAReport',
          params: { id: this.$route.params.id },
        });
      } else {
        url = this.$router.resolve({
          name: 'publicGLAReport',
          params: { id: this.$route.params.id },
        });
      }
      return window.location.origin + url.href;
    },
  },

  watch: {
    show(show) {
      if (show) {
        this.getPublicStatus();
      }
    },

    password(value) {
      if (value !== '') {
        this.isPublic = true;
      }
    },

    passwordConfirm(value) {
      if (value !== '') {
        this.isPublic = true;
      }
    },
  },

  methods: {
    async clickPublicSwitch() {
      if (this.isPublic && this.isPasswordProtected) {
        if (!this.$refs.form.validate()) {
          this.$nextTick(() => {
            this.isPublic = false;
          });
          return;
        }
      }

      await this.setPublicStatus();
    },

    async clickSavePassword() {
      if (this.$refs.form.validate()) {
        await this.setPublicStatus();
      }
    },

    async getPublicStatus() {
      try {
        const response = await glaApi.getPublicStatus(this.$route.params.id, this.selfGla);

        this.isPasswordProtected = response.is_password_protected;
        if (response.is_password_protected && response.public_password) {
          this.password = response.public_password;
          this.passwordConfirm = response.public_password;
        }

        // overwrite the watch methods on password and password confirm
        setTimeout(() => {
          this.isPublic = response.is_public;
        }, 50);
      } catch (err) {
        console.log(err);
        this.$router.push({ name: '404' });
      }
    },

    async setPublicStatus() {
      try {
        this.loading = true;
        const data = {
          is_public: this.isPublic,
        };

        if (this.isPublic) {
          data.public_password = ((!this.isSuperUser || this.isPasswordProtected)
            && this.password)
            ? this.password : null;
        }

        await glaApi.setPublicReportStatus(
          this.$route.params.id, data, this.selfGla,
        );

        this.$toast.success(this.$t('share.settingSaved'));
      } catch (err) {
        console.log(err);
        if (err.msg) this.$toast.error(err.msg);
      } finally {
        this.loading = false;
      }
    },

    copyToClipboard() {
      try {
        const container = document.querySelector('.v-dialog');

        this.$copyText(this.publicUrl, container);

        this.$toast.success(this.$t('share.linkCopied'));
      } catch (err) {
        this.$toast.error(this.$t('share.copyFailed'));
        console.log(err);
      }
    },
  },
};
</script>
