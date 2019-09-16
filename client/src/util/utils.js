
export const protectRoutes = (type, cbGoBack) => {
  let family_jwt = localStorage.getItem('family_jwt');
  let parent_jwt = localStorage.getItem('parent_jwt');
  let child_jwt = localStorage.getItem('child_jwt');

  if(type==="whichUser") {
    if(!family_jwt) {
      cbGoBack()
      return;
    } else if ( (family_jwt && parent_jwt) || (family_jwt && child_jwt) ) {
      cbGoBack()
      return;
    }
  }

  if(type==='parent') {
    if(family_jwt && !parent_jwt) {
      cbGoBack();
      return;
    } else if (family_jwt && child_jwt) {
      cbGoBack()
    } else if (!family_jwt) {
      cbGoBack()
    }
  }

  if(type==='child') {
    if(family_jwt && !child_jwt) {
      cbGoBack();
      return;
    } else if (family_jwt && parent_jwt) {
      cbGoBack()
    } else if (!family_jwt) {
      cbGoBack()
    }
  }

}

export const haveJWTNotProtected = (cbPush) => {
  let family_jwt = localStorage.getItem('family_jwt');
  let parent_jwt = localStorage.getItem('parent_jwt');
  let child_jwt = localStorage.getItem('child_jwt');
  if (parent_jwt || child_jwt) {
    localStorage.removeItem('parent_jwt');
    localStorage.removeItem('child_jwt');

    cbPush('/which-user')
  }
}
