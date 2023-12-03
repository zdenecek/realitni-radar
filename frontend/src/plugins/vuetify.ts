/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({

  defaults: {
    global: {
      ripple: false,
    },
    VTextField: {
      variant: 'outlined',
      density: 'compact',
      hideSpinButtons: true,
      hideDetails: "auto",
    },
    VChip: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VIcon: {
      color: 'secondary'
    },
    VInput: {
      density: 'compact',
      hideDetails: "auto",
    },
    VBtn: {
      variant: 'outlined',
      size: 'small',
    },  
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#01579B',
          secondary: '#1daeff',
        },
      },
    },
  },
})
