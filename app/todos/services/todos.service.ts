import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, mergeMap, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Todo } from 'src/app/models/Todo';
import { User } from '../../models/User'

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private usersCollection = this.store.collection<User>('users')
  private currentUser = this.authService.currentUser

  constructor(
    private store:AngularFirestore,
    private authService: AuthService
  ) { }

  getTodos() {
   return this.currentUser.pipe( // retorna os dados do funcionário que está logado
      mergeMap((user) => { // pega o primeiro observable e o segundo observable e transforma os dois numa coisa só. Numa situação em que queiramos os dados de dois observables, eles se complementam, é bom usar o mergeMap. Ele junta os dois observables, os dados dois dois e junta em um
       return this.usersCollection.doc(user?.uid).get() 
       // get função do firebase que pega algum método pelo id, recupera os dados de um documento no firebase
      }),
      map(userDoc => {
       return userDoc.data()?.todos || [] // ou array vazio, porque pode retornar vazio também
      })
    )
  }

  createTodo(todo: Todo) {
    return this.currentUser.pipe( // retorna os dados do funcionário que está logado
    mergeMap((user) => { // pega o primeiro observable e o segundo observable e transforma os dois numa coisa só. Numa situação em que queiramos os dados de dois observables, eles se complementam, é bom usar o mergeMap. Ele junta os dois observables, os dados dois dois e junta em um
     return this.usersCollection.doc(user?.uid).get() 
     // get função do firebase que pega algum método pelo id, recupera os dados de um documento no firebase
    }),
    mergeMap((userDoc) => {
      /* A função data retorna um objeto com os dados do documento do firebase */
      const user = userDoc.data() as User
      todo.id = this.store.createId()

      user.todos.push(todo)

      /* Função update serve para atualizar os dados de um documento no firebase */
      return userDoc.ref.update(user)
    })
    )
  }

  deleteTodo(todo:Todo){
    // código copiado de createTodo
    return this.currentUser.pipe( // retorna os dados do funcionário que está logado
    mergeMap((user) => { // pega o primeiro observable e o segundo observable e transforma os dois numa coisa só. Numa situação em que queiramos os dados de dois observables, eles se complementam, é bom usar o mergeMap. Ele junta os dois observables, os dados dois dois e junta em um
     return this.usersCollection.doc(user?.uid).get() 
     // get função do firebase que pega algum método pelo id, recupera os dados de um documento no firebase
    }),
    mergeMap((userDoc) => {
      /* A função data retorna um objeto com os dados do documento do firebase */
      const user = userDoc.data() as User

      user.todos = user.todos.filter((t) => {
        return t.id != todo.id
      })

      /* Função update serve para atualizar os dados de um documento no firebase */
      return userDoc.ref.update(user)
    })
    )
  }

  updateTodo(todo:Todo) {
    // código copiado de deleteTodo
    return this.currentUser.pipe( // retorna os dados do funcionário que está logado
    mergeMap((user) => { // pega o primeiro observable e o segundo observable e transforma os dois numa coisa só. Numa situação em que queiramos os dados de dois observables, eles se complementam, é bom usar o mergeMap. Ele junta os dois observables, os dados dois dois e junta em um
     return this.usersCollection.doc(user?.uid).get() 
     // get função do firebase que pega algum método pelo id, recupera os dados de um documento no firebase
    }),
    mergeMap((userDoc) => {
      /* A função data retorna um objeto com os dados do documento do firebase */
      const user = userDoc.data() as User

      user.todos = user.todos.map((t) => {
        if(t.id == todo.id){
          return todo
        } 
        else {
          return t
        }
      })

      /* Função update serve para atualizar os dados de um documento no firebase */
      return userDoc.ref.update(user)
    })
    )
  }
}