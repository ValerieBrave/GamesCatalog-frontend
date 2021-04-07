import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'stringList'})
export class StringList implements PipeTransform {
    transform(value: string[]): string {
        if(value) {
            let ret = ''
            value.forEach(element => ret += element+', ')
            ret = ret.slice(0, ret.length-2)
            return ret
        } else return ''
    }
}