import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'stringList'})
export class StringList implements PipeTransform {
    transform(value: string[]): string {
        if (!value) return ''
        let result = ''
        value.forEach(element => result += element+', ')
        result = result.slice(0, result.length-2)
        return result
    }
}