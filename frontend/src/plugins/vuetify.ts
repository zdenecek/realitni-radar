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

  display: {
    mobileBreakpoint: 700,
  },
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
  
    VInput: {
      density: 'compact',
      hideDetails: "auto",
    },
    VBtn: {
      variant: 'outlined',
      VIcon: {
        color: 'secondary'
      },
    },  
    VCard: {
      VTextField: {
        variant: 'outlined',
        hideSpinButtons: true,
        hideDetails: false,
      },
    },
    VListItem: {
      VIcon: {
        color: 'secondary'
      },
    }
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
