import MultipleConvs from './MulltipleConvs'

interface Conv extends Omit<MultipleConvs, 'participants'>{
  participants:string[],
  totalMsgs:number
}

export default Conv