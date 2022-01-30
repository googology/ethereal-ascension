class Separator {
  constructor(type, a = null, b = null) {
    switch (type) {
      case 0:
        this.arr = []         // Comma separator
      case 1:
        this.arr = [a]        // Unrestricted ascending & infinite ascenders
      case 2:
        this.arr = [a, b]     // Cherubims and beyond
      case 3:
        this.arr = [1, 0, 0]  // Seraphim arrays
    }
  }
}

class Array {
  constructor(nums, sep) {
    this.nums = nums;
    this.sep = sep;
  }
  evaluate() {
    // Calculate ea(nums[0] sep nums[1] sep ... sep nums[nums.length - 1])
    if (this.nums.length == 1) {return this.nums[0];}
    if (this.nums.length == 2 && !(this.nums[1] instanceof Array)) {return this.nums[0] * this.nums[1];}
    else {
      let t = 0;  // Layer we're on
      let L = [{...this}];  // Array of layers which compose our array
      let p = (n,a) => (L[a]).nums[n-1]  // Simple function for getting entries
      let k = (a) => L[a].nums.length   // Length of the innermost layer
      while (true) {
        // Now, keep looping. We should break eventually ;)
        if (p(k(t)) instanceof Array) {L.push(p(k(t))); t++;}
        else {break;}
      }
      let B = (L[t]).sep;
      if (B.arr.length == 0) {  // Innermost layer is separated with commas
        if (k(t) == 1) {  // Innermost layer is (number)
          L[t] = p(k(t),t); // Replace it with number
          // Now reconstruct the array
          for (let index = t-1; index >= 0; index--) {
            (L[index]).nums[k(index)] = L[index+1];
          }
          return (L[0]).evaluate(); // Evaluate the reconstructed array
        }
        if (p(k(t),t) == 1) {
          L[t].nums.splice(k(t)-1,1);
          // Now, once again, reconstruct the array...
          for (let index = t-1; index >= 0; index--) {
            (L[index]).nums[k(index)] = L[index+1];
          }
          return (L[0]).evaluate(); // ... And evaluate the reconstructed array
        }
        else {
          if (p(k(t)-1,t) == 1) {
            if (t == 1) {
              let F = (n) => {
                L[t].nums[k(t)-1]--;
                L[t].nums[k(t)-2] = n;
                for (let index = t-1; index >= 0; index--) {
                  (L[index]).nums[k(index)] = L[index+1];
                }
                return (L[0]).evaluate();
              }
              let s = (this.nums)[0];
              for (let index = 0; index < s; index++) {
                s = F(s);
              }
              return s;
            }
            else {
              let S = (n) => {
                if (n == 0) {return [];}
                else {return S(n-1).unshift(1);}
              }
              let F = (n) => {
                L[t].nums[k(t)-2] = L[t].nums[k(t)-1];
                L[t].nums[k(t)-1]--;
                L[t-1].nums = L[t-1].nums.splice(k(t-1)-1, 1).concat(S(n-1)).push(L[t]);
                for (let index = t-2; index >= 0; index--) {
                  (L[index]).nums[k(index)] = L[index+1];
                }
                return (L[0]).evaluate();
              }
              let s = (this.nums)[0];
              for (let index = 0; index < s; index++) {
                s = F(s);
              }
              return s;
            }
          }
          else {
            // Hmm... I just realized my code has like zero comments at this point so I'm putting this here ¯\_(ツ)_/¯
            let F = (n) => {
              L[t].nums[k(t)-2]--;
              L[t-1].nums[k(t)-2] = n;
              for (let index = t-2; index >= 0; index--) {
                (L[index]).nums[k(index)] = L[index+1];
              }
              return (L[0]).evaluate();
            }
            let s = (this.nums)[0];
            for (let index = 0; index < (this.nums)[0]; index++) {
              s = F(s);
            }
            return s;
          }
        }
      }
      if (B.arr.length == 1) {
        if (k(t) == 1) {
          L[t] = p(k(t),t);
          for (let index = t-1; index >= 0; index--) {
            (L[index]).nums[k(index)] = L[index+1];
          }
          return (L[0]).evaluate();
        }
        if (p(k(t),t) == 1) {
          L[t].nums.splice(k(t)-1,1);
          for (let index = t-1; index >= 0; index--) {
            (L[index]).nums[k(index)] = L[index+1];
          }
          return (L[0]).evaluate();
        }
        else {
          let Z = (A, n) => {
            let temp = A;
            temp.sep = new Separator(1, n);
            return temp;
          }
          let F = (n) => {
            L[t].nums[k(t)-1] = n;
            L[t] = Z(L[t], B.arr[0]-1);
            for (let index = t-1; index >= 0; index--) {
              (L[index]).nums[k(index)] = L[index+1];
            }
            return (L[0]).evaluate();
          }
          if (p(k(t)-1,t) == 1) {
            L[t] = (this.nums)[0];
            for (let index = 0; index < (this.nums)[0]; index++) {
              L[t] = F(L[t]);
            }
            for (let index = t-1; index >= 0; index--) {
              (L[index]).nums[k(index)] = L[index+1];
            }
            return Z(L[0], B.arr[0]-1).evaluate();
          }
          else {
            L[t].nums[k(t)-1]--;
            for (let index = 0; index < (this.nums)[0]; index++) {
              L[t] = F(L[t]);
            }
            for (let index = t-1; index >= 0; index--) {
              (L[index]).nums[k(index)] = L[index+1];
            }
            return Z(L[0], B.arr[0]-1).evaluate();
          }
        }
      }
      if (B.arr.length == 2 && B.arr[1] > 1 && B.arr[0] == 1) {
        (L[t]).sep = [(L[t]).sep[1]];
        for (let index = t-1; index >= 0; index--) {
          (L[index]).nums[k(index)] = L[index+1];
        }
        return Z(L[0], B.arr[0]-1).evaluate();
      }
      if (B.arr.length == 2 && B.arr[0] > 1 && B.arr[1] == 1) {
        if (k(t) == 1) {
          L[t] = p(k(t),t);
          for (let index = t-1; index >= 0; index--) {
            (L[index]).nums[k(index)] = L[index+1];
          }
          return (L[0]).evaluate();
        }
        if (p(k(t),t) == 1) {
          L[t].sep = new Separator(2, B.arr[0], p(k(t)-1,t));
          for (let index = t-1; index >= 0; index--) {
            (L[index]).nums[k(index)] = L[index+1];
          }
          return (L[0]).evaluate();
        }
        else {
          if (p(k(t)-1,t) == 1) {
            if (t == 1) {
              let F = (n) => {
                L[t].nums[k(t)-1]--;
                L[t].nums[k(t)-2] = n;
              }
              L[t] = (this.nums)[0];
              for (let index = 0; index < (this.nums)[0]; index++) {
                L[t] = F(L[t]);
              }
              for (let index = t-1; index >= 0; index--) {
                (L[index]).nums[k(index)] = L[index+1];
              }
              return (L[0]).evaluate();
            }
            else {
              let S = (n) => {
                if (n == 0) {return [];}
                else {return S(n-1).unshift(1);}
              }
              let F = (n) => {
                L[t-1] = L[t-1].splice(k(t-1),1).concat(S(n-1)).push(L[t]);
                for (let index = t-2; index >= 0; index--) {
                  (L[index]).nums[k(index)] = L[index+1];
                }
                return (L[0]).evaluate();
              }
              let s = (this.nums)[0];
              for (let index = 0; index < (this.nums)[0]; index++) {
                s = F(s);
              }
              return s.evaluate();
            }
          }
          else {
            let F = (n) => {
              (L[t])[k(t)-2]--;
              (L[t-1])[k(t)-2] = n;
              for (let index = t-1; index >= 0; index--) {
                (L[index]).nums[k(index)] = L[index+1];
              }
              return (L[0]).evaluate();
            }
            let s = (this.nums)[0];
            for (let index = 0; index < (this.nums)[0]; index++) {
              s = F(s);
            }
            return s;
          }
        }
      }
      if (B.arr.length == 2 && B.arr[0] > 1 && B.arr[1] > 1) {
        if (k(t) == 1) {
          L[t] = p(k(t),t);
          for (let index = t-1; index >= 0; index--) {
            (L[index]).nums[k(index)] = L[index+1];
          }
          return (L[0]).evaluate();
        }
        if (p(k(t),t) == 1) {
          (L[t])[k(t)-1]++;
          L[t].sep = new Separator(2, B.arr[0]-1, B.arr[1]);
        }
        else {
          let Z = (J, n, m) => {
            let temp = J;
            temp.sep = new Separator(2, n, m);
            return temp;
          }
          
          let F = (n) => {
            let temp = Z(L[t], B.arr[0], B.arr[1]-1);
            temp.nums[temp.nums.length-1] = n;
            return temp.evaluate();
          }
          
          if (p(k(t), t) == 1) {
            L[t] = (this.nums)[0];
            for (let index = 0; index < (this.nums)[0]; index++) {
              L[t] = F(L[t]);
            }
            for (let index = t-1; index >= 0; index--) {
              (L[index]).nums[k(index)] = L[index+1];
            }
            return Z(L[0], B.arr[0], B.arr[1]-1).evaluate();
          }
          
          else {
            L[t].nums[L[t].nums.length-1]--;
            for (let index = 0; index < (this.nums)[0]; index++) {
              L[t] = F(L[t]);
            }
            for (let index = t-1; index >= 0; index--) {
              (L[index]).nums[k(index)] = L[index+1];
            }
            return Z(L[0], B.arr[0], B.arr[1]-1).evaluate();
          }
        }
      }
      if (B.arr.length == 3) {
        if (k(t) == 1) {
          L[t] = p(k(t),t);
          for (let index = t-1; index >= 0; index--) {
            (L[index]).nums[k(index)] = L[index+1];
          }
          return (L[0]).evaluate();
        }
        if (p(k(t), t) == 1) {
          (L[t]).sep = new Separator(2, p(k(t)-1,t), 1);
          (L[t].nums)[k(t)-1]++;
          (L[t].nums)[k(t)-2] = 1;
          for (let index = t-1; index >= 0; index--) {
            (L[index]).nums[k(index)] = L[index+1];
          }
          return (L[0]).evaluate();
        }
        else {
          let F;
          if (p(k(t)-1, t) == 1) {
            if (t == 1) {
              F = (n) => {
                (L[t])[k(t)-1]--;
                (L[t])[k(t)-2] = n;
                for (let index = t-1; index >= 0; index--) {
                  (L[index]).nums[k(index)] = L[index+1];
                }
                return (L[0]).evaluate();
              }
            }
            else {
              let S = (n) => {
                if (n == 0) {return [];}
                else {return S(n-1).unshift(1);}
              }
              
              F = (n) => {
                (L[t])[k(t)-1]--;
                (L[t])[k(t)-2] = (L[t])[k(t)-1] + 1;
                L[t-1].nums = L[t-1].nums.splice(k(t-1)-1, 1).concat(S(n-1)).push(L[t]);
                for (let index = t-2; index >= 0; index--) {
                  (L[index]).nums[k(index)] = L[index+1];
                }
                return (L[0]).evaluate();
              }
            }
          }
          else {
            F = (n) => {
              (L[t].nums)[k(t)-2]--;
              (L[t-1].nums)[k(t)-2] = n;
              for (let index = t-2; index >= 0; index--) {
                (L[index]).nums[k(index)] = L[index+1];
              }
              return (L[0]).evaluate();
            }
          }
          let s = (this.nums)[0];
          for (let index = 0; index < (this.nums)[0]; index++) {
            s = F(s);
          }
          return s;
        }
      }
    }
  }
}
