/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Slider from 'react-native-slider'
import OpenCV from './NativeModules/OpenCV'

type Props = {}
export default class App extends Component<Props> {
  state = {
    processedImage64: TEST_IMAGE_BASE64,
    contrastValue: 1,
  }

  changeImageContrast(imageAsBase64) {
    const { contrastValue } = this.state
    console.log('TCL: App -> changeImageContrast -> imageAsBase64 (incoming)', imageAsBase64)

    return new Promise((resolve, reject) => {
      OpenCV.changeImageContrast(imageAsBase64, contrastValue, (error, dataArray) => {
        console.log('TCL: App -> changeImageContrast JS -> dataArray (recived): ', dataArray)
        resolve(dataArray[0])
      })
    })
  }

  testMethod = () => {
    this.changeImageContrast(TEST_IMAGE_BASE64).then(data => {
      console.log('TCL: App -> testMethod -> data', data)
      if (data) {
        this.setState({ processedImage64: data })
      }
    })
  }

  onValueChange = contrastValue =>
    this.setState({ contrastValue }, () => {
      this.changeImageContrast(TEST_IMAGE_BASE64).then(data => {
        console.log('TCL: App -> onValueChange -> data', data)
        if (data) {
          this.setState({ processedImage64: data })
        }
      })
    })

  render() {
    const { contrastValue, processedImage64 } = this.state

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.testMethod}>
          <Text style={styles.title}>Change Contrast</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{contrastValue}</Text>
        <Slider
          style={styles.slider}
          value={contrastValue}
          onValueChange={this.onValueChange}
          step={0.1}
          minimumValue={0}
          maximumValue={2.5}
          thumbTintColor={'#efefef'}
          minimumTrackTintColor={'#F8A136'}
          maximumTrackTintColor={'#5E82BC'}
        />
        <Text style={styles.instructions}>Move the slider left or right</Text>
        {processedImage64 && (
          <Image
            style={{ height: 300, width: 300, backgroundColor: 'red' }}
            source={{ uri: `data:image/png;base64,${processedImage64}` }}
            resizeMode="contain"
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  slider: {
    height: 40,
    width: '90%',
    shadowColor: '#333333',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
})

const TEST_IMAGE_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAL4AAACeCAYAAACM2LCrAAAKq2lDQ1BJQ0MgUHJvZmlsZQAASImVlgdUE9kax+/MpBdaINIJNRTp0qXXUKRXGyEJEEoICUHFrogruKKIiKCyoCtNwVUpIipiwbYINuwLsiio62LBhpo3yCPuvnfee+f9z7kzv3z57ne/OzP3nD8AlJtsoTADVgAgU5AjivD3YsTFJzDwwwACCCCjVyKbIxZ6hoUFA1Qz97/r3W00D9UN86la//7/f5UilyfmAACFoZzEFXMyUT6Gjk6OUJQDACJE4/pLcoRTXIqysghtEOW6KU6Z5s4pTprmvm85URHeKP8OAIHCZotSACCPo3FGLicFrUNBdwusBFy+AGUPlN04qWwuymtQnp2ZmTXFB1E2TvpLnZS/1UyS1WSzU2Q8vZdvIvjwxcIM9rL/83H8b2VmSGbW0EcHJVUUEDG13tRzS88KkrEgaV7oDPO50z1NcaokIHqGOWLvhBnmsn2CZHMz5gXPcDLfjyWrk8OKmmFRVoSsPk/sGznDbNH3tSTp0Z6ydXksWc281KjYGc7lx8ybYXF6ZND3HG9ZXCSJkPWcLPKT7TFT/Jd98Vmy/JzUqADZHtnfe+OJ42Q9cHk+vrK4IFqWI8zxktUXZoTJ8nkZ/rK4ODdSNjcH/di+zw2TPZ80dmDYDAM+CAFswMnhLc2Zatg7S7hMxE9JzWF4oieGx2AJOBazGTZW1k4ATJ2/6df7hv7tXEH0y99j61sAcD0llUpPfI8FbQXgKBMAUt/3GHMbAPIaAFys5khEudMxzNQFC0hAHigDNaCNfj/GwBzYAHvgAjyALwgEoSAKxINFgANSQSYQgSVgBVgLCkAR2Ap2gApQBfaBOnAIHAFtoBOcARfAFdAHboH7YBCMgOdgHLwDkxAE4SEqRIPUIB3IEDKDbCBHyA3yhYKhCCgeSoRSIAEkgVZA66EiqASqgKqheugX6Dh0BroE9UN3oSFoDHoNfYIRmAIrw1qwEWwJO8KecBAcBS+EU+BsOA/Oh7fA5XANfBBuhc/AV+Bb8CD8HJ5AAEJG6IguYo44It5IKJKAJCMiZBVSiJQhNUgT0oH0IDeQQeQF8hGDw9AwDIw5xgUTgInGcDDZmFWYzZgKTB2mFXMOcwMzhBnHfMVSsZpYM6wzloWNw6Zgl2ALsGXYA9gW7HnsLewI9h0Oh6PjmDgHXAAuHpeGW47bjNuDa8Z14fpxw7gJPB6vhjfDu+JD8Wx8Dr4Avwt/EH8afx0/gv9AIBN0CDYEP0ICQUBYRygjNBBOEa4TnhImiQpEQ6IzMZTIJS4jFhP3EzuI14gjxEmSIolJciVFkdJIa0nlpCbSedID0hsymaxHdiKHk/nkNeRy8mHyRfIQ+SNFiWJK8aYsoEgoWyi1lC7KXcobKpVqRPWgJlBzqFuo9dSz1EfUD3I0OQs5lhxXbrVcpVyr3HW5l/JEeUN5T/lF8nnyZfJH5a/Jv1AgKhgpeCuwFVYpVCocVxhQmFCkKVorhipmKm5WbFC8pDiqhFcyUvJV4irlK+1TOqs0TENo+jRvGoe2nrafdp42ooxTZiqzlNOUi5QPKfcqj6soqcxRiVFZqlKpclJlkI7Qjegsega9mH6Efpv+aZbWLM9ZvFmbZjXNuj7rvaqGqocqT7VQtVn1luonNYaar1q62ja1NrWH6hh1U/Vw9SXqe9XPq7/QUNZw0eBoFGoc0binCWuaakZoLtfcp3lVc0JLW8tfS6i1S+us1gtturaHdpp2qfYp7TEdmo6bDl+nVOe0zjOGCsOTkcEoZ5xjjOtq6gboSnSrdXt1J/WYetF66/Sa9R7qk/Qd9ZP1S/W79ccNdAxCDFYYNBrcMyQaOhqmGu407DF8b8Q0ijXaaNRmNMpUZbKYecxG5gNjqrG7cbZxjfFNE5yJo0m6yR6TPlPY1M401bTS9JoZbGZvxjfbY9Y/GzvbabZgds3sAXOKuad5rnmj+ZAF3SLYYp1Fm8VLSwPLBMttlj2WX63srDKs9lvdt1ayDrReZ91h/drG1IZjU2lz05Zq62e72rbd9tUcszm8OXvn3LGj2YXYbbTrtvti72Avsm+yH3MwcEh02O0w4KjsGOa42fGiE9bJy2m1U6fTR2d75xznI85/upi7pLs0uIzOZc7lzd0/d9hVz5XtWu066MZwS3T7yW3QXded7V7j/thD34PrccDjqaeJZ5rnQc+XXlZeIq8Wr/fezt4rvbt8EB9/n0KfXl8l32jfCt9Hfnp+KX6NfuP+dv7L/bsCsAFBAdsCBlhaLA6rnjUe6BC4MvBcECUoMqgi6HGwabAouCMEDgkM2R7yYJ7hPMG8tlAQygrdHvowjBmWHXYiHBceFl4Z/iTCOmJFRE8kLXJxZEPkuyivqOKo+9HG0ZLo7hj5mAUx9THvY31iS2IH4yzjVsZdiVeP58e3J+ATYhIOJEzM952/Y/7IArsFBQtuL2QuXLrw0iL1RRmLTi6WX8xefDQRmxib2JD4mR3KrmFPJLGSdieNc7w5OznPuR7cUu4Yz5VXwnua7Jpckjya4pqyPWUs1T21LPUF35tfwX+VFpBWlfY+PTS9Nl2aEZvRnEnITMw8LlASpAvOZWlnLc3qF5oJC4SD2c7ZO7LHRUGiA2JIvFDcnqOMGp2rEmPJBslQrltuZe6HJTFLji5VXCpYenWZ6bJNy57m+eX9vByznLO8e4XuirUrhlZ6rqxeBa1KWtW9Wn91/uqRNf5r6taS1qav/XWd1bqSdW/Xx67vyNfKX5M/vMF/Q2OBXIGoYGCjy8aqHzA/8H/o3WS7ademr4XcwstFVkVlRZ83czZf/tH6x/IfpVuSt/QW2xfv3YrbKth6e5v7troSxZK8kuHtIdtbSxmlhaVvdyzecalsTlnVTtJOyc7B8uDy9l0Gu7bu+lyRWnGr0quyebfm7k273+/h7rm+12NvU5VWVVHVp5/4P92p9q9urTGqKduH25e778n+mP09Pzv+XH9A/UDRgS+1gtrBuoi6c/UO9fUNmg3FjXCjpHHs4IKDfYd8DrU3mTdVN9Obiw6Dw5LDz35J/OX2kaAj3UcdjzYdMzy2u4XWUtgKtS5rHW9LbRtsj2/vPx54vLvDpaPlhMWJ2k7dzsqTKieLT5FO5Z+Sns47PdEl7HpxJuXMcPfi7vtn487ePBd+rvd80PmLF/wunO3x7Dl90fVi5yXnS8cvO15uu2J/pfWq3dWWX+1+bem172295nCtvc+pr6N/bv+p6+7Xz9zwuXHhJuvmlVvzbvXfjr59Z2DBwOAd7p3Ruxl3X93LvTd5f80D7IPChwoPyx5pPqr5zeS35kH7wZNDPkNXH0c+vj/MGX7+u/j3zyP5T6hPyp7qPK0ftRntHPMb63s2/9nIc+HzyRcFfyj+sful8ctjf3r8eXU8bnzkleiV9PXmN2pvat/Oeds9ETbx6F3mu8n3hR/UPtR9dPzY8yn209PJJZ/xn8u/mHzp+Br09YE0UyoVskXsb1YAQQecnAzA61oAqPEA0FDfTJo/7Y+/CZr29N8I/Cee9tDfZA9AE3qbskLeXQAcRoeRBwBy6O8pGxTlAWBbW9n4p8TJtjbTtSioa8R+kErfaAGA7wDgi0gqndwjlX7ZjzZ7F4Cu7GlfPiUc6t+b8GOjR4r7Oyw/g3/RPwD85gqf+Glg5gAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAWJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8ZXhpZjpVc2VyQ29tbWVudD5TY3JlZW5zaG90PC9leGlmOlVzZXJDb21tZW50PgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KbszeLgAAIipJREFUeAHtnflzHMd1x98Ci/smAd4XeIgiRZGURIuWEsuy7DhxrDiVcg5XuZzYyQ+p/DvJD/khTlVSlbjiVPxDnIrtil06fUiyJFKiRIoQT/EAQAIkcS7O3Xw/PRxisJgFFiQWWOz0Yy13MdPT0/3626/fe/26O/Xa62/kzJPnQMI4UJWw+vrqeg44DnjgeyAkkgMe+Ilsdl9pD3yPgURywAM/kc3uK+2B7zGQSA544Cey2X2lPfA9BhLJAQ/8RDa7r7QHvsdAIjnggZ/IZveV9sD3GEgkBzzwE9nsvtIe+B4DieSAB34im91X2gPfYyCRHPDAT2Sz+0p74HsMJJIDHviJbHZfaQ98j4FEcsADP5HN7ivtge8xkEgOpKtSqURW3Fc62RxId3V1JpsDvvaJ5EC6uro6kRX3lU42B7yOn+z2T2ztPfAT2/TJrrgHfrLbP7G198BPbNMnu+Ie+Mlu/8TW3gM/sU2f7Ip74Ce7/RNbew/8xDZ9sivugZ/s9k9s7T3wE9v0ya64B36y2z+xtU8ntuYVXvGcjvQbm5ixiamsVVelrK05bT4Sd67RVxX4UzNZu9KXsb7BibkSRH6lFCJdX1tlLY1pa1dDdbXVWXV1eYVNZ7M5O3t11O6MTFmrynlge5M1NawqGyMcK/xzXKB/v2fIbg5M2LbOejvxeLv135m0a7cyhR/Ku9PVUWeP72y2YiLX7wxP2SefjdrMbM72bWuyrRvrTKyy67cz9ll/xnW+px5rs8a68giKXNUWm5nJ2eWb43bm0vB9FueBWn/WCOh1NVUCU7UD1dF9rdZYXx7MotAzas3zamA6MI27XaAqR+DfGZlWOcdseHzGDuxsMnMgnLB3zt3Lg3fhPx/f3Szg61nLa6eYR4bGZuy9nmGb1AjTWJ+2zRvqbFa8unYreGdNusoe39X8APhjE7OOj/dGp91odGxfm6VXUcitKvBDfnGwLqxk+I1WluF5YmrWMmLeaGbW7o3M2LQkyMlD7VarzlAuVJMOOiffjFLlRoysSHpAz+i5s6shGDnFX3gP1QqIS6k+Qdsso35h5sErXBuTR11NtcGrKE2qnS/cHLObtydta2edHd3bqtvz00TTr/TvNQE+lYDpXzy+0XZIYkaxM61G67k+Zm+dvWeZSTFHv/dta3TD9UpX/mHyAzBfOdGlIT3Qnetry2c0CuszJqFxuXdcqkbO9mxpsGaBPx9SXzi6wfaKr1WLyJOa6qp5bRPmX+x3jYTV04+12hPdUpf0rykyctNHZmc1gkqwzeqz2rRmwKeidTUpa5DOFwU+fx/pbrHbd6fs4yujNjg87fTpLVIrUJUykhRI2QYBjjU0wxpi6SBpNdLG1ho1ZNDESL2MhlOMO9jaINuhQYwHuCGRZmJS9wWQtK5HGyZMM613YiRClI3nGZmyWTpvmGr+N/mO3383d7Bb0G2joxaNPap8yQvVjg4U8oFrjHyT01kH2GbZEFFbB7CQf07/KA/lCgmwD0rf7pU+z71dmxvc++FdlOpUJmyUkF/Re4V+u3JNzxoda4qyqf68u6WQjaNX8gy8SqWC91M+1JwRjUYh4FGJUJUob31dlfsuVIaVur6mwC9UCUC8oa3G3aZxMwInjd0ro/jUhWHXkE/saXEMPHd1xG7fm7JN7XX2+892uYYYHJKhdW1UxtyUoUMywLc319gmjDXpmRtba12j3VGn+kD5javj0GmeP7JhnupFg2Ccnfp02EnGZ2ScbZHuevrCkN1Sx9zQUmPHD7RaW9P9sqpt78roPX9NQ7jKOuTenXKGOs89JkMxfDeN/6szd13H3Lmp3nX2EMCA/sylEb17wgEeVW+zyh52DMr00eURB6gDOxrt0O6WB6yko16UHQWotirfzrba+ypNALwHCZf5A8D2Dk46vZzv0cyM6zTUZ//2Rme85mdJm1EWbI20+uaXnup0z2Bn0GZh2wyNztjrpwdd2z25t8V2bmrIz2rF/y5L4MNkJHFI6IkIV6TEJTGyWYYvkuSG9FjsADpHq8AnnDqgwtirMj5paoxknsUY5Vr/3Uk7KQ/HDjEXCY90vDkwaQP30q5T0DlCAkQ96kAXpYsCctyC5EkHvNI7YRnppof3NLvklIe8f3XmjjPoqAOSMGeBJ+uz/gkHnOeOdKjz1LuOBHiuyuPBiLJ3a+MDyc31CzfGXP20G4Bt02i3qZ3OGgwxqDEXro+7keKQDNAowaMruo8quV3PtTWtTBPfUCd888M7rg6MkIxSGLHYEnw2SHAgKKIEDxAu8A9p/jtHstL1q5x3CeDTMXiCkY22pD1Qa1eDVoYrD1lShkCYFVUZ4B0ShYaHLag0+UPy+ERW92lck6RsdpK8VQ08pWH4tCQ4IMeoe+Zgm0BT70p3YyBj734yZFd75VoTKDZIUqFC4JVBeiNlP5OrLwr8SeWHVwK44RJs06hRiEj73vl77t0Y7U8f0Lv1DCChPu9+EnRG1J2XnqpxwEHS4+obHJp2as8GSWfehWGPV4buHvBjQt9thpJGOQc0ogGa9pYqvWOuo+JqpVMwmrSIH9u66h3Q4sp87sqI9UkdmlP85qfCU/WkDM4GqR68893zQ64eqFz75cJ9UupovdQcvDiMTggImT1LEoLoy890ug7xjniCSsto++JTG526t1IddamCrBnw6elnpaYgLVxr6286wtDYtJPA6O5IrV2bNVwj7SI1CQzLanv+yQ47KPUBMHH/vJiPVEcyfu7xNkMdQsJAMBcJ/raMZoB4SQDBluje2mDn5JcHbEi1Y/sCqSS8ar6BIX3W5Y/rEj19OqZ1Sct7L6lTIQmPyQV7VEM2dkPw7lrXwVFtAGbv7gkn4VF/SI/Eo/Nt62xw9WCOgBEPEADiAXUM7AbtDOBsHsqEUUrHQjCERBqcAZSH+m7VyFKIPlOHvi6PSiFCRTootRDgMyrRSaDt6mhfPLbRCQ2x2b0LdzN21uW+cZU/2lILc2fURG1jFGcUgGg/BFDYVgufWvkrawZ8hsFPro490FvDqtFoUK0MX4DxlCQnEj+8zj2S7N5S7yZKQh8/xtate5POHkD6I7kBFJ+QdkgCvieGAyb05IPyUaN2dEiN4dpd6eQMwQCKkQiQ8s3oENWxw/zCb+pyVaMFZQBwGwWaCd4beTfvaGmsll4bqGu7ZXSinjFJxKQSAuAJdUTqSScA2Ad3NTl7AQN9QHXbtblR5Zt0hi3A2aM8QvWHsqAuUIdauQ63q64Y84WITkynK4TTZpU1HImxmaZVFwDK5BSjaUiAHzUQW4ORdr3QXA1WucTIBcDgmB++WxeZwALMTuIImB0tte4uKkNISBWAyLAZEgAfHQ88HbhE3/r47jxDlXSAONArc26IZo4AjwvGGaPAiJ5Hsm2VeoQEu6lrlJOyAOaCpKKhy1JEOtApzZgu8FurfM7DpDTo8CqKk5p07uuSvtgHqA3U85Z+Ay48MtgTdATuMyIMqGOSDzPbqHEAD6LzIe3JA0O+e0tjIUy79CcPtzt9upBXh9EWaQ8xH8DEXaOAv6ljIR/Io0WdGGE1Na2KrQNaO+CLsSekjjAch43HN0DEuwHjC5GcPk6/ZNgMCVAz1EN4NABxnI8aIwxiVGDo4D17BJLfSoel4wAwdFqkJy5D3GuMFOGw7B7O+4+mRtpDzk15XxVxFyL/8c42TYRinFM9hvYuqXHUGRchhjbvuSv9focmnRjptgjc/QBfHqrh8Wkn0ckSz0ddRM25q45Hp6Usm9SZ6KyLEdIbG6cQ8KPP4gqlU4dljt4Lf9MUQXtQgvKntQO+eIMOSwPB0OUQjRXBvHsUEIXuQAyzF45teDA9Hs07bBZGGnzZEBM8OwXuc1K9QjfbFemrjByoOaglixHFZ5SiHq2SxM8dabe2xoWGcPhuVBE3OaTncAdiDGPkYeg2yVMyo4kdRkOAiVT/8OKI3ZPNw6iEqsR79sg2ie4Fhn5NZ6fjoHYUA+jF6hS9h8qEEMEGYyTMJzoFHT/s/Pn3y/HvoOXLsWTLLBNganGuy5ST2Bh96PnEjIQf1Ie+OxN2Tfo90jMEB+rVgR1NrnFRWTDmUC/QFTBq0cUXJaVDzwWQqFKAOnxn+E3HGBgKgsSYNwhVNwDOh04B8LE9qEu7rtGZN0u14G9Gn4vydOGudAJDHSYcFbmHYY6619GSdqPFouVd5s121T8t5E9KEOD5AuhRCkdIRt31QhUDfECCbg4o0HNPXxxy4MaTgy4POHCf4Vn5QBNSqBbCqSM6QJcmwBh98BjhnkPdQHoyrb/UiAQAsRPqNYoMSyL3aAKLyRneS0cArB8qMO/VU3fst3KpTqlMYaaMPNgrvItZalSsRnXgsCPhMtyoybwx2QVX5DUCXKhe4ehGBTDqcXFSzn1yNVKOpYj64zJFvSr0QbfHRcrogmGOynNJbuSr/eOuk1E3RgAEBZN2y4E9PAtHbTrsuLxYjBir1XnWTNVZqmEe5j6TUrgnCXXAY4TOvluxKhBqAg2E+oJ+TNooMXlCXAuSnplECA8NbralCMBtlq1CNCOd5mP5yAlH4D10LmZxmQ/g3bvVQdDrw0Ynb7xIjAgTI4QC5Nx9RgGIOQfUHSbAsGH4G/0fHR0CfHiEmPKnMzARFo5kLkGB/36pibZff3S3wN3gMrz76olONyId0kQd8yC4Vl95f9B1dCbo6DTMztIpmHEPwxAWzVg3KX+oagYztwOu3t1b8bTNzU0slc/D3q8o4CM9nznY7qb5kboAHd03JMDdLZUGjwaGY5QYMQAUwEUVwVDrlrQPARZNG/ebdCc0YQYx+YZ0ZpYZwgvVKCMZ9+mzCj9olh4fpS6NNG1N1TJcAy84ZQtdhoAY4NNR0K6xBzDQQ8N+WPMehDYgKem4zmiPZl7gN+nxgS1GgJgUSGcmsxg9P9GcB6Ph2/fDm7mHp4dRiEnFUGgsli/38BhRXrxUdFpGDOrBJOFqAD/V09OzeO2XqsEy7iOdGMoZlmlIfMLFNhR6JYsdADOGFqG2hVyMuPvQldHXUTN4b2M9HpQgfj4EVX7RUYcwagmLpnx4e0LJG6YFMEx+jaixcKfuklSPqh3ou0hgJGP47qYGAugAhyIlJSWFlQV0Ve9F9YAYEUgbEoF5AE6vdioH7wyjQvHrE6KBuvC0Yom4FyfxKTden3AiKsx7sW86IOBEKECMWICT9mOikS6NaglQcaFio1AO5hCoA20WvhNPHJONUV6hkgZzD1PuOQQXPIdXpaZVBX6pK5OfP/op6gHeCPzqDMVxoMt/biX+Xq13A0bmDiA6FRNbpSbqBsDhJbZJXEdbThnoIHRMhM2j5lXseysa+MUywadLHgeCMSx59fY1TjgHPPATDoCkVt8DP6ktn/B6e+AnHABJrb4HflJbPuH1nj+T8ojMwC2Fz5ywx9V0HT5isVf1cdyP8tzNI1yQ4YTUvBv+j8U5wDYN05pPmNFMO+CLEhMHac1+1+gT48NeEeADdmY7WVxNDDuFYNaTndBi3hktXqJ+4/s+c3H4QWhxWHnWme7WxI0Hf8iRJb6Fr9ydQUudO2tVVy5b1a1+SwH++zPROU2s5VpaLLt1u2X3H7DUvv2aKp6bECT3RwI+EyfMprJwghlVZuGYjWNVEL9/T/vPFJolXaJqFXmbqX7iiJhtjRKTN0RxEpLsaQkOAPrPrlrND//dGj94y6qyQVxV/FMpm25osfE//gvLfeWr2nlgbmH+sjmNdCdm/aYWb7N3C/sxEiPOCqCQCLll8QRhA9GtL8L7Sf0G+EQzznEq4ASLzVlj27R0PFxSWfeg3rm+Xqv9l+9b0yendC1Y/PPg5oIfChHPDFvzj/7NxqaF0Ze/oRVMAZOXBD54BshId6Q6MSXEoRCrQSRhEMa04I0uDJiISOJxig30WphL5VyBjywij1vIwajp9vapnOqubE0CEGongiGr/dd/tsbzp5U/oCc8Q2qNNIx8YcKVFM/pu3paod4/+ZGNtbVZ7oUXFWdRG6/qkB4JjiGGGkPUHWG1rBUlACwq3ZVzLJGGACXi0qNbdsQmLvOLxKbkG6TLLTLBa/ck8VFr8mlSAoTALzbFiu6Ylp9uqb+BAbEuFWFXobNPTVlubNRSn35q1R9/aDVnz1jdrWsCNLFJWt/b3GGZr3/TsocOK357vgxPZcYt/fOfWeN7bzp1KJ0ZsaYffN8m3/61zRx/ej7ww+AjogqJtPtU4bVEOIYLBBY22eJNgUrE4goi9aK7ASz+VHndBbB0elZu5W/Dt5ySYtje0MZVcTxk1CSGn9h24u0flli0whoAoiVXI1jtYcu56HOA/d5dS5163+reeMVqblyxqmkt+s/JdtQnMGDR3Ztt/JvfNnvpK5aSBF9AErwzO3bauL6b3v+lpWQLpCfGrPrsu5Y7976ldd1F2rHahi0sLiuOnO0uCNFFOBVSZRa8KOYCkZHo+YS2RsNRY5KW5SXiz4nP/412bOD3oxK8LkR9g8GC8kL3i7lOl/moacReenqjUzGLeaZs0kjC565ft6r3fmsNb/zCagZuSlIj2RcybTZda5kvv+xAj9oSSwiQjg6b+c73LDM6bA1Sj4LOgwqkPYrYzJ8tLMI467ihODbjIi8ycozsC1YHFflI2SRjdzQkMdK61OSspYVtvOzXsk7grMrMSqx1M8pmtB/Pm69bw09/bHX9V+9L9viqZ6uqbfzkl2z2T74ZSHqNEHbtM0nv+Z4y27RZC6E3aHFDl03+5d9Y6h//3hqufapMg7ZMv/L+gAwudhRePtdZ0M02eCygQEeNIzw+6PosLngU/TUu71JfY8Qb19rU9USUOYzPXxflFmCrfvgDa3z1p5aeGluiyFp0f+w5m/3Wty3VqH1aWGjx+qtWrw5TlZn/7PSuvTb1139rqc2bLbVrt01++7tW9U//YHWDvXqHYv/div9lgt4tN5PezpDKDrgsuSu0VTQeoYsyjlmhvx5p+eKgDGq5ngotSd/4WnGgz+w9bNN/Lr1+40ZhV5X86Iw1/Pd/Wn3vZau91z/v03jmHefrtxGdvsM+LIefsMyffcemG4PlocuK1WFFKMvD2KH3D05ucnsrsnSQ7a+PaK9I7uUTbcBi62F5dxbTcfOf838ngwPp0+9Z9VT8mWhRDky1ddrkH0m9AfTj45bTjG3tj/7Dagf7lGxhT8fz0/DO65b62U+0FZzAj9F89JhlXvqaZasLuDOjLwx/I+XZtu7Y/lY3KcXei6EDAsCz3pOFz+yFznZzUcIrxDpV9ol8FK9FNE//uzI4kO3Y6Pzw98+NKFApeeVrBNY3XzP7zZsO59X9N61eOntqkUms6tkpa/6fH1rm0kW2dQjynpwy7IT5zs8Cr2Vd5Q7p8mx9zX6OcTEldITPH+5w3qCr2goj6utng2G8Rcf1POk8eQ6EHMielM7+m9esaoxD6eYLzDAN1+vk5eEznwqln0vF5FXz6V/NXXC/pOPnXVnwJ6d9sM/8l5/u1J41iwdSscHr55/oCA4xUF8MCcOZiSxmcj15DszjwIHHbPzlP72ve89hZl4a9wcgz/8sTBV/ZeFzBYGPasOekRiwz+oEEbaPWIpQfdjN7KTAn79tCOoOW+CFW+ctlZe/nxAO1NVZ7mtft7Hv/p1lduy3nNSQIBShtPVPo8bkE9ce0+ZHnO/UIcAvZ8sH1KBuTViNH2rTxM89N+tL/nQKZiaZKAvPjMp/r/87oRwQ+O35521S4cOTH31odf/3v1bXiz9f2zw6j8jSKs1yOZf+3h/uWPBM6L1hI6HQgF2QaJELPMdpIwSoRecHGEXW4wzuIlX1t1aKA8TabNumPc67bOJzJ23y4gWrksen9uyHlh5UvP2sdom+H7bwcJ2BYDadWMlHO5KlW2O2s16JurACq6Vx4WiyEnn7PCqUA0h3rZpKKdTAnjlh2eNP6WQZTYz29lqq57ylbly36v5eqx64ZakJHTukMAcXv8NElusUwchAtKbUFAdyk+qERyjb0mazm7Zocco2y+7cXZxXp0LZ7KtVThwYGTHTiqqcpH5K4HSTTmmNAnz27rMcH5WXadBpLTnM3ZMXaHTEUpr5zenDt1uGCOhRne5/csTft7VbqnluEQrVLsqdSUJPngMl5cDwkNX91w8kuRUOf/yEzT77nKW6uwPg579YM7FuIovJLJGgXpAK3Uuf1VK4taXgzFS39I4NVde2MP7ta8UBJLtav+F6jwzbKzbz5i9spmurzRw8bLNHj1tKEt9J8ftqjCsmv6HwO/gr+D8aJsDv8CO1iLDn9KunBqLJ1+Q3Rm+Xtpr+XR3fySmEnpLHgZx0+2xLq6t41awO5Ri6rc+AZS+ds+zPf2zZ+kab7eiymS3S0bdttxzqkFQYFpGjzqTqtZic49MF8NyUdl6Y0LGvExNayKKTNQcGrOqm7IPeG1Z9q8+qRwR8gtTKgSb6s3Z7h1YhKayBjuApWRxIaRuQHEB2Y35gpArFisnXkU0AeUqhy8ODWmh+3qVxBqxjkbDi4ILXhh/3lxyGWTjLQEncCDC3HLFsdPwZDUHsA4+B7uYwXKX8f4nhgICfbQ0iJ+PrHCA5ADBAjk9V7NWy8je6TllsyX26yuLAA4m/OtUqK+CvTpX9W8qSA/LU5KTjz6kwpS3lqgAfnZ1QBv558hyI5QD6OYZq1epo3wve4uCpMkTDimMLusRF8mGlP8e8Y7Bu66xzB6Kxw5onz4FYDsg7k9Usa5Xi6EtN84CPZOZEPQDLEfLROJtiC8JCE07CJjqT08L369zV8JA2FqwQmvyonarYsvh064sDuCWztXJnT5R+bmke8NnxjMUkHJT2+unBB6fwFcM+TuHjUGL20GGxCqcScipglDjJjw5BbL4nz4F8DqSk6uCvN60ULDU9AD6qyTYdX88eOEj8p7Ra6q2zd4tasc+xkEf3tepU7eCoxrgVWlQkPD7ygwtaf1vqmvn81x0HcnX1lmvQ7gmrQA+MW6T8kywYr61y55qyoJxPXLx+WC5MVY6YZIUWa27dFnic2ViAGBUYCcIzWvOTYd94Si4HUg1SdZpWGfioJ1sl8cNZU+LmT+iU8D1b49fY0jyN2taarUWO6tTruB0W8psQYKMKuS0F82+6vz3yY9mSlIsKO8g1zo+iLFXVncRHqh/a3eSAHH0Re9s/r2WEW2LCCJpkwJ442GrHpOIsZzfkdtkBdLBC6lD0/f53wjgg4zbnJH7pBaBTTHZtrnfBYXFgxCPz3JEOd3R7WJwA9O12fH/bskBPM/IOjFx/YETCQF1MdVk8osMbWCVVaqqqk97NEsFCQET1YQfeZw+1a0SotmapN89Inz+6r2XZoA8rg8TvkORfDxNa69LuCCVUyPB19J1rbnFLA0td5DRbSgPsOGkfvhwvz0HtljbNBjlyxxze01LQQA2fWewb+4FRQx1c+8UvlnJt7zEcYryvp70o4SnCab1STiulslp/S2hyKSmN+7JNvvWlCG/Pk91BvPRydPpC+a7CaFbo1UVfx/v0hBbNM+/A3vjl7oJldMJlfHhPs9ZmrFOxL+DnqtnKRmHIJaR0t7w2xW4fshKAL2FdVjxrRronNLpt0NaJ/TrkIm6P/HBbdU6XvB8YvuLlCDNkTyJGSN4VB2w8azu66nSQ3DpezIOqo7CFEuPe0oV86iGzk/5dr5Fuz9Ym26XjOPNFPiPAZe0JyqkpnXIC4N4lfdq5DFaOc6iYGR3BxN73nJjI0aBs8LVApusCNtl6FfZwDFUnV6PF4iWmpXWcEhdgPWQPkOI2ux2bCA5hYBt0wjO2KzZphz5d6gRsmtWoa+G8yHLryemSHMnE2cF9OoeMgzv6FOfEIRUvHjdrl0dtvZ03UBQPkPiFTjkpKoPiEnngF8en2FQE8t3SsaazUkHYIW746qj1aLdo4pFYPI/jAFUJb1ixxGIcDtk4r5Nq+gV4PuMT8w/u+PT6uNuavZAnrth3lWO6lA5mzhGoVmJywF8To21NXrpy3AwOc9MxRwJ8lOgEdyWl+XD43WM7mIIvHvjkxVGqp3UCetzRoNynM3AYXVN9U9H2Gc+tC9J+ONkGqZVOkSsdSNIfXBh2MfOrzRSkGtJtvRJnAVzpyzhpH1cH5igIy+YkwuUQahX6+0aFh9+4vfAwaPJCDeIcAsJM6iptgbIYEK7ECtfXLod/xaZNv3t+qNi0K5puVo23XuPy8eT0ScVBohciPEJ7Fa3KPqLLJdzLRMre5HjQGOkA365J5787MmObO+YO6Fjue8o1PbstMHvrtgcsUSHTHMnpaXkcQAW5cH0s9rDmMKctAu4GnRfwMA4eOsu2ToV1XBt3ak+YZ/QbT1LPtVEX8BdneEfTrrff2Y4NJQ9bWL44KhEXcc0x61jurjgEMKc84mUpRHhy2Co9fyFOofRx1wnrYDVcobAObR/pTpkZ02nzlUa5g4/bbHO4x05palc2wG9SaEC7XIAP6/4rDXsW5oqa03Nt7MG+/wtTaPZUqgrAXWwtQ9xz0WvwY3tnvfJAJCwk5pHxJHG2WMWRgD/+rb+yyc7tqlp8/R+1zmnCitea0IcBCudslbvEx6/OpFUh+4Rmwo25Qef6PgqRD4c0c1jz5Ei8OsopM5wtRhxVRZ07wD6av/uCZbRN4JSOA63/9StWk9Fuyo4exSMSdCLsh/QXjur05zUmpt9ZAbZYoNwaF9G9HjXnws0xG1vk0Oe6mmpnmBKE96hESDg7VAzpkGzcpPlE58M7xnGqRNhWFAH+xw7a7M6dNvrCl6z63Xes9u03dLynDonISs9T3eX/UZUX8mU+H4KtBQF7VjPCk3sP2fQXXrR0RUmK+TVe8b9wBNyQbs+WKTVsUBpDhC5s13qDuFiamOSLXmJmll0q+nUyPPMGcYR3DO/SHoUxlLvgiCv/otcY/nWCeerAAct2d9vEy9+wCU5K0XFB6U8/sXTfDavSqYbsO+lcnzocwqlGeo5TTzhPa7ap1Wa6D9js44ctd+SoWWen23U51dPTs1SXWbRsSbqJN+f67cyi+j1hzAAf9W0laEIxOlf7xuW7jwc+72iVbcSheyv1zpUod8nyYOTjw3bf2gnZBm5bikMlRrUlSUb2jnZkMxazcBBEe4elADqjB50o/KhwHvglayGfcTlzoGy8OuXMJF+2yuOAB37ltamvUREc8MAvgkk+SeVxwAO/8trU16gIDnjgF8Ekn6TyOOCBX3lt6mtUBAc88Itgkk9SeRzwwK+8NvU1KoIDHvhFMMknqTwOeOBXXpv6GhXBAQ/8Ipjkk1QeBzzwK69NfY2K4IAHfhFM8kkqjwMe+JXXpr5GRXDAA78IJvkklccBD/zKa1NfoyI44IFfBJN8ksrjgAd+5bWpr1ERHPDAL4JJPknlccADv/La1NeoCA544BfBJJ+k8jjggV95beprVAQHPPCLYJJPUnkc8MCvvDb1NSqCAx74RTDJJ6k8DqRnZipvf/XKayZfo5XmQPr27YGVztPn5zlQ9hxI+x1jy76NfAFLwAGv45eAqT7L8ueAB375t5EvYQk44IFfAqb6LMufAx745d9GvoQl4IAHfgmY6rMsfw544Jd/G/kSloADHvglYKrPsvw54IFf/m3kS1gCDnjgl4CpPsvy54AHfvm3kS9hCTjggV8Cpvosy58DHvjl30a+hCXggAd+CZjqsyx/Dvw/ZuKZBXCX4RsAAAAASUVORK5CYII='
