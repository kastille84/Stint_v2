
export const protectRoutes = (type, cbPush) => {
  let family_jwt = localStorage.getItem('family_jwt');
  let parent_jwt = localStorage.getItem('parent_jwt');
  let child_jwt = localStorage.getItem('child_jwt');

  if(type==='parent') {
    if(family_jwt && !parent_jwt) {
      cbPush('/which-user');
      return;
    }
  }
  if(type==='child') {
    if(family_jwt && !child_jwt) {
      cbPush('/which-user');
      return;
    }
  }
}