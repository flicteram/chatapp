import MultipleConvs from './MulltipleConvs'

interface Conv extends Omit<MultipleConvs, 'participants'>{
  participants:string[]
}

export default Conv