const num = document.querySelector('#txtnum')
const amostra = []


/*Input*/
document.querySelector('#btn').onclick = () => {
    const selAmostra = document.querySelector('#amostra')
    const opt = document.createElement('option')
    
    if(num.value.length == 0) {
        alert('Digite um número!')
    } else {
        amostra.push(Number(num.value))
        opt.text = Number(num.value)
        selAmostra.appendChild(opt)
    }
    num.value = ''
    num.focus()
}

/*Calc*/
function casasDecimais(num, precisao) {
    var casas = Math.pow(10, precisao);
    return Math.floor(num * casas) / casas;
}

const calcClasse = (amostra, intervalo) => {
    const classe = []
    for(let i=amostra[0]; i<=amostra[amostra.length-1]; i+= intervalo) {
        classe.push(i)
    }
    return classe
}

const calcFa = (classe) => {
    const fa = []

    for(let i=0; i<classe.length-1; i++) {
        let somador = 0

        for(let j of amostra) {
            if(j >= classe[i] && j < classe[i+1]) {
                somador++
            }
        }
        fa.push(somador)
    }

    for(let i in amostra) {
        if(classe[classe.length-1] === amostra[i]) {
            fa[fa.length-1]++
        }
    }

    return fa
}

const somaFa = (fa) => fa.reduce((ac, cv) => ac + cv)

const calcFaa = (fa) => {
    let c = 0
    return fa.map((e) => c += e)
}

const calcFr = (fa, somatorioFa) => fa.map(e => casasDecimais(e / somatorioFa * 100, 1))

const somaFr = (fr) => fr.reduce((ac, cv) => ac + cv)

const calcFra = (fr) => {
    let c = 0
    return fr.map(e => casasDecimais(c += e, 1))
}

const calcPm = (fa, classe, intervalo) => fa.map((e, i) => casasDecimais(classe[i] + intervalo / 2, 1))

const calcpmXfa = (pm, fa) => pm.map((e, i) => e * fa[i])

const somapmXfa = (pmXfa) => pmXfa.reduce((ac, cv) => ac + cv)

const calcMa = (a, b) => casasDecimais(a / b, 1)

const calcMo = (fa, classe, intervalo) => {
    const faEscolhido = fa.reduce((ac, cv, i) => {return ac > cv ? ac : cv})
    const liEscolhido = fa.indexOf(faEscolhido) 
    const faAnterior = fa[liEscolhido - 1] || 0
    const faPosterior = fa[liEscolhido + 1] || 0

    return casasDecimais((classe[liEscolhido] + [(faEscolhido - faAnterior) / ((faEscolhido - faAnterior) + (faEscolhido - faPosterior))] * intervalo), 1)
}

const calcMd = (somatorioFa, faa, fa, classe, intervalo) => {
    const faEscolhidoMd = somatorioFa / 2
        let faaEscolhidoMd
        for(let e of faa) {
            if(e >= faEscolhidoMd) {
                faaEscolhidoMd = e
                break
            }
        }
        const indice = faa.indexOf(faaEscolhidoMd)
        const liEscolhidoMd = classe[indice]
        const faaAnterior = faa[indice - 1] || 0
        return casasDecimais((liEscolhidoMd + [(faEscolhidoMd - faaAnterior) / fa[indice]] * intervalo), 1)
}

/*OutPut*/
document.querySelector('#btnCalc').onclick = () => {
    if(amostra.length > 2) {
        const selclasse = document.querySelector('#classe')
        const selfa = document.querySelector('#fa')
        const selfaa = document.querySelector('#faa')
        const selfr = document.querySelector('#fr')
        const selfra = document.querySelector('#fra')
        const selpm = document.querySelector('#pm')
        const selpmxfa = document.querySelector('#pmxfa')

        let opt = document.createElement('option')

        const amostraOrganizada = amostra.sort((a, b) => a > b ? 1 : -1)
        const amplitude = amostraOrganizada[amostraOrganizada.length-1] - amostraOrganizada[0]
        let numLinhas 
        let intervalo
        
        for(let i=0; i<amplitude; i++) {
            for(let j=0; j<amplitude; j++) {

                if(i*j === amplitude && i < j) {
                    numLinhas = j
                    intervalo = i
                }
            }
        }
        
        const classe = calcClasse(amostraOrganizada, intervalo)
        const fa = calcFa(classe)
        const somatorioFa = somaFa(fa)
        const faa = calcFaa(fa)
        const fr = calcFr(fa, somatorioFa)
        const somatorioFr = somaFr(fr)
        const fra = calcFra(fr)
        const pm = calcPm(fa, classe, intervalo)
        const pmXfa = calcpmXfa(pm, fa)
        const somatoriopmXfa = somapmXfa(pmXfa)
        const ma = calcMa(somatoriopmXfa, somatorioFa)
        const mo = calcMo(fa, classe, intervalo)
        const md = calcMd(somatorioFa, faa, fa, classe, intervalo)

        for(let i of classe) {
            //output class
            let opt = document.createElement('option')
            opt.text = i
            selclasse.appendChild(opt)
        }

        for(let i in fa) {
            //output fa
            let opt = document.createElement('option')
            opt.text = fa[i]
            selfa.appendChild(opt)
            //output faa
            let opt1 = document.createElement('option')
            opt1.text = faa[i]
            selfaa.appendChild(opt1)
            //output fr
            let opt2 = document.createElement('option')
            opt2.text = `${fr[i]}%`
            selfr.appendChild(opt2)
            //output fra
            let opt3 = document.createElement('option')
            opt3.text = `${fra[i]}%`
            selfra.appendChild(opt3)
            //output pm
            let opt4 = document.createElement('option')
            opt4.text = pm[i]
            selpm.appendChild(opt4)
            //output pmxfa
            let opt5 = document.createElement('option')
            opt5.text = pmXfa[i]
            selpmxfa.appendChild(opt5)

        }

        //Somatório FA
        opt.text += `Σ${somatorioFa}`
        selfa.appendChild(opt)

        //Somatório FR
        let opt2 = document.createElement('option')
        opt2.text += `Σ${somatorioFr}%`
        selfr.appendChild(opt2)

        //Somatório PMxFA
        let opt3 = document.createElement('option')
        opt3.text += `Σ${somatoriopmXfa}`
        selpmxfa.appendChild(opt3)

        document.querySelector('#result').innerHTML = `MA = ${ma} | MO = ${mo} | MD = ${md}`
    } else {
        alert('Preencha a Amostra antes de calcular!')
    }

}

document.querySelector('[btnHelp]').onclick = () => {
    const helper = document.querySelector('#help');
    const state = helper.style.display;
    helper.style.display = state === 'block' ? 'none' : 'block';
}
