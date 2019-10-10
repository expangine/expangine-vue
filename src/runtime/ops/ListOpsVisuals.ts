import { ListOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(ListOps.create, {
    name: 'Create List',
    description: 'Create a List value (empty)',
    singleline: 'create list',
    comments: {},
  });

  registry.addOperation(ListOps.maybe, {
    name: 'Try List?',
    description: 'If the [value] is list, return the list value, otherwise return undefined',
    singleline: '{value} to list?',
    comments: {
      value: 'The value to convert to list or undefined',
    },
  });

  registry.addOperation(ListOps.build, {
    name: 'Build List',
    description: 'Build a List with [count] items of [item]',
    singleline: 'build list with {count} items of {item} using the same item {sameItem}',
    comments: {
      count: 'The number of items to be placed in the list',
      item: 'The item to place in the list. If [sameItem] is true the same exact item is placed at each index, otherwise a new item will be generated for each index in the list.',
      sameItem: 'If only one item should be created and used, otherwise each item in the list is created dynamically',
    },
    scopeComments: {
      list: 'The list being built',
      count: 'The number of items being placed in the list',
      index: 'The index of the item being created',
      last: 'The last item added to the list',
    },
    defaults: {
      sameItem: 'true',
    },
  });

  registry.addOperation(ListOps.get, {
    name: 'Get Item',
    description: 'Get an item from [list] at [index]',
    singleline: 'get {list} [ {index} ]',
    comments: {
      list: 'The list to get an item from',
      index: 'The index of the item in the list',
    },
  });

  registry.addOperation(ListOps.set, {
    name: 'Set Item',
    description: 'Set a [value] in [list] at [index] ',
    singleline: 'set {list} [ {index} ] = {value}',
    comments: {
      list: 'The list to set an item to',
      index: 'The index in the list',
      value: 'The item to set in the list at the given index',
    },
  });

  registry.addOperation(ListOps.add, {
    name: 'Add Item',
    description: 'Add an [item] to [list]',
    singleline: '{list} add {item}',
    comments: {
      list: 'The list to add to',
      item: 'The item to add',
    },
  });

  registry.addOperation(ListOps.addFirst, {
    name: 'Add Item First',
    description: 'Add an [item] to the start of a [list]',
    singleline: '{list} add {item} to start',
    comments: {
      list: 'The list to add to',
      item: 'The item to add',
    },
  });

  registry.addOperation(ListOps.addLast, {
    name: 'Add Item Last',
    description: 'Add an [item] to the end of a [list]',
    singleline: '{list} add {item} to end',
    comments: {
      list: 'The list to add to',
      item: 'The item to add',
    },
  });

  registry.addOperation(ListOps.insert, {
    name: 'Insert Item',
    description: 'Add an [item] to [list] at [index]',
    singleline: '{list} add {item} at {index}',
    comments: {
      list: 'The list to add to',
      item: 'The item to add',
      index: 'The index to insert at',
    },
  });

  registry.addOperation(ListOps.remove, {
    name: 'Remove Item',
    description: 'Remove an [item] from [list] where [isEqual]',
    singleline: 'remove {item} from {list} where is equal {isEqual}',
    comments: {
      list: 'The list to remove from',
      item: 'The item to remove',
      isEqual: 'The comparison of the item to remove and an item in the list',
    },
    scopeComments: {
      list: 'The list to remove from',
      value: 'The item to remove',
      test: 'The current item in the list being compared',
    },
  });

  registry.addOperation(ListOps.removeFirst, {
    name: 'Remove First Item',
    description: 'Removes first item from [list]',
    singleline: 'remove first item from {list}',
    comments: {
      list: 'The list to remove from',
    },
  });

  registry.addOperation(ListOps.removeLast, {
    name: 'Remove Last Item',
    description: 'Removes last item from [list]',
    singleline: 'remove last item from {list}',
    comments: {
      list: 'The list to remove from',
    },
  });

  registry.addOperation(ListOps.removeAt, {
    name: 'Remove Item At',
    description: 'Removes item at [index] from [list]',
    singleline: 'remove item at {index} from {list}',
    comments: {
      list: 'The list to remove from',
      index: 'The index of the item to remove',
    },
  });

  registry.addOperation(ListOps.removeWhere, {
    name: 'Remove Items Where',
    description: 'Removes items from [list] that meet criteria [where]',
    singleline: 'remove items {where} from {list}',
    comments: {
      list: 'The list to remove from',
      where: 'The condition that must be true for an item to be removed',
    },
    scopeComments: {
      list: 'The list to being removed from',
      item: 'The current item being compared to',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.contains, {
    name: 'List Contains Item',
    description: 'Determines if an [item] in [list] exists where [isEqual]',
    singleline: 'contains {item} in {list} where is equal {isEqual}',
    comments: {
      list: 'The list to search through',
      item: 'The item to look for',
      isEqual: 'The comparison of the item to check for containment',
    },
    scopeComments: {
      list: 'The list being searched through',
      value: 'The item being looked for',
      test: 'The current item in the list being compared',
    },
  });

  registry.addOperation(ListOps.find, {
    name: 'Find Item Where',
    description: 'Finds an item in [list] that meet criteria [where], starting at [start] and optionally searching in [reverse]',
    singleline: 'find item in {list} where {where} starting at {start} and searching in reverse {reverse}',
    comments: {
      list: 'The list to search through',
      where: 'The condition used to find the item being searched',
      reverse: 'If the list should be searched in reverse, defaults to false',
      start: 'The index to starting searching from, defaults to 0',
    },
    scopeComments: {
      list: 'The list being searched through',
      item: 'The current item being compared to',
      index: 'The index of the current item',
    },
    defaults: {
      reverse: 'false',
      start: '0 for forward, length - 1 for reverse',
    },
  });

  registry.addOperation(ListOps.copy, {
    name: 'Copy List',
    description: 'Copy [list] optionally doing a [deepCopy] of each item in the list',
    singleline: 'copy {list} and deep copy the items with {deepCopy}',
    comments: {
      list: 'The list to copy',
      deepCopy: 'The expression which copies the current item [copy]',
    },
    scopeComments: {
      copy: 'The item to copy',
    },
    defaults: {
      deepCopy: 'none',
    },
  });

  registry.addOperation(ListOps.reverse, {
    name: 'Reverse List',
    description: 'Reverse a [list]',
    singleline: 'reverse {list}',
    comments: {
      list: 'The list to reverse',
    },
  });

  registry.addOperation(ListOps.exclude, {
    name: 'Exclude List from List',
    description: 'Removes all items in [exclude] from [list]',
    singleline: 'remove {exclude} items from {list} where items are equal {isEqual}',
    comments: {
      list: 'The list to remove shared items from',
      exclude: 'The list of items to exclude from [list]',
      isEqual: 'Determines if two items are considered equal',
    },
    scopeComments: { 
      list: 'The list having items excluded from',
      value: 'The first item to compare',
      test: 'The second item to compare',
    },
  });

  registry.addOperation(ListOps.overlap, {
    name: 'Overlap Lists',
    description: 'Returns a list of all items in [list] and [overlap]',
    singleline: 'return items in both {list} and {overlap} where items are equal {isEqual}',
    comments: {
      list: 'The first list to check',
      overlap: 'The second list to check',
      isEqual: 'Determines if two items are considered equal',
    },
    scopeComments: {
      list: 'The first list being checked',
      value: 'The first item to compare',
      test: 'The second item to compare',
    },
  });

  registry.addOperation(ListOps.sort, {
    name: 'Sort List',
    description: 'Sorts [list] based on [compare]',
    singleline: 'sort {list} and compare items with {compare}',
    comments: {
      list: 'The list to sort',
      compare: 'The comparison expression',
    },
    scopeComments: {
      list: 'The list being sorted',
      value: 'The first item to compare',
      test: 'The second item to compare',
    },
  });

  registry.addOperation(ListOps.shuffle, {
    name: 'Shuffle List',
    description: 'Randomly shuffles [list] [times]',
    singleline: 'shuffle {list} {times} times',
    comments: {
      list: 'The list to shuffle',
      times: 'The number of times to shuffle the list',
    },
    defaults: {
      times: '1',
    },
  });

  registry.addOperation(ListOps.unique, {
    name: 'Unique items from List',
    description: 'Returns a list with the unique items from [list]',
    singleline: 'get unique items from {list} with comparison {isEqual}',
    comments: {
      list: 'The list to get unique items from',
      isEqual: 'The comparison expression',
    },
    scopeComments: {
      list: 'The list getting unique items from',
      value: 'The first item to compare',
      test: 'The second item to compare',
    },
  });

  registry.addOperation(ListOps.duplicates, {
    name: 'Duplicate items from List',
    description: 'Returns a list with the duplicate items from [list]',
    singleline: 'get duplicate items from {list} with comparison {isEqual} and only allow duplicates once {once}',
    comments: {
      list: 'The list to get duplicate items from',
      isEqual: 'The comparison expression',
      once: 'Whether the resulting list should contain a duplicate from [list] only once or for each extra duplicate',
    },
    scopeComments: {
      list: 'The list getting duplicate items from',
      value: 'The first item to compare',
      test: 'The second item to compare',
    },
    defaults: {
      once: 'false',
    },
  });

  registry.addOperation(ListOps.take, {
    name: 'Get first N items from List',
    description: 'Get first [count] items from [list]',
    singleline: 'get first {count} items from {list}',
    comments: {
      list: 'The list to get items from',
      count: 'The maximum number of items to take',
    },
  });

  registry.addOperation(ListOps.skip, {
    name: 'Get items from List skipping first N items',
    description: 'Get items in [list] starting at [count]',
    singleline: 'get items in {list} starting at {count}',
    comments: {
      list: 'The list to get items from starting at [count]',
      count: 'The number of items to skip',
    },
  });

  registry.addOperation(ListOps.drop, {
    name: 'Get items from List without the last N items',
    description: 'Get items in [list] without the last [count] items',
    singleline: 'get items in {list} without the last {count}',
    comments: {
      list: 'The list to get a items from without the last [count]',
      count: 'The number of items to drop from the end',
    },
  });

  registry.addOperation(ListOps.append, {
    name: 'Append List',
    description: 'Return a list with [append] added to the end of [list]',
    singleline: '{list} + {append}',
    comments: {
      list: 'The first list of items',
      append: 'The second list of items',
    },
  });

  registry.addOperation(ListOps.prepend, {
    name: 'Prepend List',
    description: 'Return a list with [prepend] added to the start of [list]',
    singleline: '{prepend} + {list}',
    comments: {
      list: 'The first list of items',
      prepend: 'The second list of items to add to the start',
    },
  });

  registry.addOperation(ListOps.indexOf, {
    name: 'Item Index',
    description: 'Finds the index of an [item] in a [list]',
    singleline: 'find {item} in {list} where is equal {isEqual} starting at {start}',
    comments: {
      list: 'The list to search through',
      item: 'The item to look for',
      start: 'The starting index',
      isEqual: 'The comparison of the item',
    },
    scopeComments: {
      list: 'The list being searched through',
      value: 'The item being looked for',
      test: 'The current item in the list being compared',
    },
    defaults: {
      start: '0',
    },
  });

  registry.addOperation(ListOps.lastIndexOf, {
    name: 'Item Index from End',
    description: 'Finds the last index of an [item] in a [list]',
    singleline: 'find {item} in {list} starting at the end where is equal {isEqual} starting at {start}',
    comments: {
      list: 'The list to search through',
      item: 'The item to look for',
      start: 'The starting index, defaults to 0',
      isEqual: 'The comparison of the item',
    },
    scopeComments: {
      list: 'The list being searched through',
      value: 'The item being looked for',
      test: 'The current item in the list being compared',
    },
    defaults: {
      start: '0',
    },
  });

  registry.addOperation(ListOps.findIndex, {
    name: 'Find Index in List',
    description: 'Finds the first index in the [list] that meets the [where] criteria',
    singleline: 'find index in {list} where {where} searching in reverse {reverse} starting at {start}',
    comments: {
      list: 'The list to search through',
      start: 'The starting index, defaults to 0',
      reverse: 'If the search should start at the end',
      where: 'The condition used to find the item being searched',
    },
    scopeComments: {
      list: 'The list being searched through',
      item: 'The current item being looked at',
      index: 'The index of the current item',
    },
    defaults: {
      reverse: 'false',
      start: '0 for forward, length - 1 for reverse',
    },
  });

  registry.addOperation(ListOps.last, {
    name: 'Last Item',
    description: 'Get the last item in [list]',
    singleline: 'last of {list}',
    comments: {
      list: 'The list to get the last item from',
    },
  });

  registry.addOperation(ListOps.first, {
    name: 'First Item',
    description: 'Get the first item in [list]',
    singleline: 'first of {list}',
    comments: {
      list: 'The list to get the first item from',
    },
  });

  registry.addOperation(ListOps.count, {
    name: 'Count Items',
    description: 'Get the number of items in a [list]',
    singleline: '# of items in {list}',
    comments: {
      list: 'The list to count',
    },
  });

  registry.addOperation(ListOps.randomList, {
    name: 'Random List',
    description: 'Get random [count] items from [list]',
    singleline: 'get {count} items randomly from {list}',
    comments: {
      list: 'The list to get items from',
      count: 'The number of items to randomly get',
    },
  });

  registry.addOperation(ListOps.random, {
    name: 'Random Item',
    description: 'Get random item from [list]',
    singleline: 'get random item from {list}',
    comments: {
      list: 'The list to get an item from',
    },
  });

  registry.addOperation(ListOps.join, {
    name: 'Join Items into Text',
    description: 'Join items from [list] into text using a [delimiter]',
    singleline: 'join items in {list} with delimiter {delimiter} by converting items to text with {toText} and adding the prefix {prefix} and suffix {suffix}',
    comments: {
      list: 'The list to join the items of',
      delimiter: 'The delimiter used to join the items',
      toText: 'Converts each item to text',
      prefix: 'The text to add to the start of the result',
      suffix: 'The text to add to the end of the result',
    },
    scopeComments: {
      list: 'The first list joining the items of',
      item: 'The current item to join',
      index: 'The index of the current item',
    },
    defaults: {
      delimiter: '", "',
      prefix: 'none',
      suffix: 'none',
      toText: 'system method',
    },
  });

  registry.addOperation(ListOps.each, {
    name: 'Iterate List',
    description: 'Iterate over [list] and call [each] for each item optionally going in [reverse]',
    singleline: 'iterate {list} calling {each} for each item in reverse {reverse}',
    comments: {
      list: 'The list to iterate',
      each: 'The expression to call for each item in the list',
      reverse: 'If the list should be iterated in reverse order',
    },
    scopeComments: {
      list: 'The list being iterated',
      item: 'The current item being iterated',
      index: 'The index of the current item',
    },
    defaults: {
      reverse: 'false',
    },
  });

  registry.addOperation(ListOps.filter, {
    name: 'Filter List',
    description: 'Get a filtered [list] based on a [filter]',
    singleline: 'filter {list} where {filter}',
    comments: {
      list: 'The list to filter',
      filter: 'If true the item will be in the result, otherwise it will be skipped',
    },
    scopeComments: {
      list: 'The list being filtered',
      item: 'The current item being evaluated',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.not, {
    name: 'Filter List (not)',
    description: 'Get a filtered [list] based on [not] passing criteria',
    singleline: 'filter {list} where not {not}',
    comments: {
      list: 'The list to filter',
      not: 'If false the item will be in the result, otherwise it will be skipped',
    },
    scopeComments: {
      list: 'The list being filtered',
      item: 'The current item being evaluated',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.map, {
    name: 'Transform List Items',
    description: 'Get a copy of [list] where each item is [transform]ed',
    singleline: 'transform {list} with {transform}',
    comments: {
      list: 'The list to transform',
      transform: 'The expression which transforms an item to a new value',
    },
    scopeComments: {
      list: 'The list being transformed',
      item: 'The current item being transformed',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.split, {
    name: 'Split List',
    description: 'Splits a [list] into two lists, one that [pass]es a test and one that fails',
    singleline: 'split {list} into pass/fail based on {pass}',
    comments: {
      list: 'The list to split',
      pass: 'When true the item is placed in the pass list, otherwise the fail list',
    },
    scopeComments: {
      list: 'The list being split',
      item: 'The current item being evaluated',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.reduce, {
    name: 'Reduce List',
    description: 'Reduces a [list] to a single value',
    singleline: 'reduce {list} with {reduce} and the initial value {initial}',
    comments: {
      list: 'The list to reduce to a single value',
      reduce: 'The expression that takes the currently [reduced] value and the [item] and returns a new reduced value',
      initial: 'The first [reduced] value to pass to [reduce]',
    },
    scopeComments: {
      list: 'The list being reduced to a single value',
      reduced: 'The current value being reduced, initially [initial]',
      item: 'The current item being evaluated',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.cmp, {
    name: 'Compare Lists',
    description: 'Compares lists [value] and [test] using [compare]',
    singleline: 'compare {value} and {test} using {compare}',
    comments: {
      value: 'The first list to compare',
      test: 'The second list to compare',
      compare: 'The expression that compares two items',
    },
    scopeComments: {
      list: 'The first list being compared',
      value: 'The first item to compare',
      test: 'The second item to compare',
    },
  });

  registry.addOperation(ListOps.group, {
    name: 'Group Items By',
    description: 'Group items in [list] by [by] and transform items with [getValue]',
    singleline: 'group items in {list} by {by} and transform items with {getValue}',
    comments: {
      list: 'The list to group',
      by: 'Takes the current item and returns a value to group items by',
      getValue: 'Transform the item into a different value',
    },
    scopeComments: {
      list: 'The list being grouped',
      item: 'The current item to group',
      index: 'The index of the current item',
    },
    defaults: {
      getValue: 'no transform',
    },
  });

  registry.addOperation(ListOps.toListMap, {
    name: 'Group Items into Map',
    description: 'Group items in [list] into a map by [getKey] and transform items with [getValue]',
    singleline: 'group items in {list} into a map by {getKey} and transform items with {getValue}',
    comments: {
      list: 'The list to group',
      getKey: 'Takes the current item and returns a key to group items by',
      getValue: 'Transform the item into a different value',
    },
    scopeComments: {
      list: 'The list being grouped',
      item: 'The current item to group',
      index: 'The index of the current item',
    },
    defaults: {
      getValue: 'no transform',
    },
  });

  registry.addOperation(ListOps.toMap, {
    name: 'Items to Map',
    description: 'Convert items in [list] into a map by [getKey] and transform items with [getValue]',
    singleline: 'convert items in {list} into a map by {getKey} and transform items with {getValue}',
    comments: {
      list: 'The list to convert',
      getKey: 'Takes the current item and returns a key to convert items by',
      getValue: 'Transform the item into a different value',
    },
    scopeComments: {
      list: 'The list being converted',
      item: 'The current item to convert',
      index: 'The index of the current item',
    },
    defaults: {
      getValue: 'no transform',
    },
  });

  registry.addOperation(ListOps.min, {
    name: 'Items Min',
    description: 'Get minimum [value] in a [list]',
    singleline: 'minimum {value} in {list}',
    comments: {
      list: 'The list to search through',
      value: 'The expression which takes an item and returns a number value',
    },
    scopeComments: {
      list: 'The list being searched',
      item: 'The current item to get a value from',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.max, {
    name: 'Items Max',
    description: 'Get maximum [value] in a [list]',
    singleline: 'maximum {value} in {list}',
    comments: {
      list: 'The list to search through',
      value: 'The expression which takes an item and returns a number value',
    },
    scopeComments: {
      list: 'The list being searched',
      item: 'The current item to get a value from',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.sum, {
    name: 'Items Sum',
    description: 'Get sum of a [value] in a [list]',
    singleline: 'sum of {value} in {list}',
    comments: {
      list: 'The list to search through',
      value: 'The expression which takes an item and returns a number value',
    },
    scopeComments: {
      list: 'The list being searched',
      item: 'The current item to get a value from',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.avg, {
    name: 'Items Average',
    description: 'Get average [value] in a [list]',
    singleline: 'average {value} in {list}',
    comments: {
      list: 'The list to search through',
      value: 'The expression which takes an item and returns a number value',
    },
    scopeComments: {
      list: 'The list being searched',
      item: 'The current item to get a value from',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.std, {
    name: 'Items Standard Deviation',
    description: 'Get standard deviation of a [value] in a [list]',
    singleline: 'standard deviation of {value} in {list}',
    comments: {
      list: 'The list to search through',
      value: 'The expression which takes an item and returns a number value',
    },
    scopeComments: {
      list: 'The list being searched',
      item: 'The current item to get a value from',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.variance, {
    name: 'Items Variance',
    description: 'Get variance of a [value] in a [list]',
    singleline: 'variance of {value} in {list}',
    comments: {
      list: 'The list to search through',
      value: 'The expression which takes an item and returns a number value',
    },
    scopeComments: {
      list: 'The list being searched',
      item: 'The current item to get a value from',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.median, {
    name: 'Items Median',
    description: 'Get median of a [value] in a [list]',
    singleline: 'median of {value} in {list}',
    comments: {
      list: 'The list to search through',
      value: 'The expression which takes an item and returns a number value',
    },
    scopeComments: {
      list: 'The list being searched',
      item: 'The current item to get a value from',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.bitand, {
    name: 'Items Bitwise AND',
    description: 'Get bitwise AND of a [value] in a [list]',
    singleline: 'bitwise AND of {value} in {list}',
    comments: {
      list: 'The list to search through',
      value: 'The expression which takes an item and returns a number value',
    },
    scopeComments: {
      list: 'The list being searched',
      item: 'The current item to get a value from',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.bitor, {
    name: 'Items Bitwise OR',
    description: 'Get bitwise OR of a [value] in a [list]',
    singleline: 'bitwise OR of {value} in {list}',
    comments: {
      list: 'The list to search through',
      value: 'The expression which takes an item and returns a number value',
    },
    scopeComments: {
      list: 'The list being searched',
      item: 'The current item to get a value from',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.bitxor, {
    name: 'Items Bitwise XOR',
    description: 'Get bitwise XOR of a [value] in a [list]',
    singleline: 'bitwise XOR of {value} in {list}',
    comments: {
      list: 'The list to search through',
      value: 'The expression which takes an item and returns a number value',
    },
    scopeComments: {
      list: 'The list being searched',
      item: 'The current item to get a value from',
      index: 'The index of the current item',
    },
  });

  registry.addOperation(ListOps.isValid, {
    name: 'Is List?',
    description: 'Determines whether [value] is a valid value for List',
    singleline: 'is {value} list?',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(ListOps.isEmpty, {
    name: 'Is Empty?',
    description: 'Determines whether [list] is empty',
    singleline: 'is {list} empty?',
    comments: {
      list: 'The list to check',
    },
  });

  registry.addOperation(ListOps.isNotEmpty, {
    name: 'Is Not Empty?',
    description: 'Determines whether [list] is not empty',
    singleline: 'is {list} not empty?',
    comments: {
      list: 'The list to check',
    },
  });

  registry.addOperation(ListOps.isEqual, {
    name: 'Lists Equal?',
    description: 'Determines whether [list] is equal to [test] using [isEqual] to compare items',
    singleline: '{list} equals {test} where items equality is {isEqual}',
    comments: {
      list: 'The list to evaluate',
      test: 'The test list to compare against',
      isEqual: 'Compares two items for equality',
    },
    scopeComments: {
      list: 'The list being evaluated',
      value: 'The first item being compared',
      test: 'The second item being compared',
    },
  });

  registry.addOperation(ListOps.isNotEqual, {
    name: 'Lists Not Equal?',
    description: 'Determines whether [list] is not equal to [test] using [isEqual] to compare items',
    singleline: '{list} not equal to {test} where items equality is {isEqual}',
    comments: {
      list: 'The list to evaluate',
      test: 'The test list to compare against',
      isEqual: 'Compares two items for equality',
    },
    scopeComments: {
      list: 'The list being evaluated',
      value: 'The first item being compared',
      test: 'The second item being compared',
    },
  });

  registry.addOperation(ListOps.isLess, {
    name: 'Is List Less?',
    description: 'Determines whether [value] is less than [test] using [compare] to compare items',
    singleline: '{value} < {test} using {compare}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      compare: 'Compares two items',
    },
    scopeComments: {
      list: 'The list being compared',
      value: 'The first item being compared',
      test: 'The second item being compared',
    },
  });

  registry.addOperation(ListOps.isLessOrEqual, {
    name: 'Is List Less or Equal?',
    description: 'Determines whether [value] is less than or equal to [test] using [compare] to compare items',
    singleline: '{value} <= {test} using {compare}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      compare: 'Compares two items',
    },
    scopeComments: {
      list: 'The list being compared',
      value: 'The first item being compared',
      test: 'The second item being compared',
    },
  });

  registry.addOperation(ListOps.isGreater, {
    name: 'Is List Greater?',
    description: 'Determines whether [value] is greater than [test] using [compare] to compare items',
    singleline: '{value} > {test} using {compare}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      compare: 'Compares two items',
    },
    scopeComments: {
      list: 'The list being compared',
      value: 'The first item being compared',
      test: 'The second item being compared',
    },
  });

  registry.addOperation(ListOps.isGreaterOrEqual, {
    name: 'Is List Greater or Equal?',
    description: 'Determines whether [value] is greater than or equal to [test] using [compare] to compare items',
    singleline: '{value} >= {test} using {compare}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      compare: 'Compares two items',
    },
    scopeComments: {
      list: 'The list being compared',
      value: 'The first item being compared',
      test: 'The second item being compared',
    },
  });


  registry.addOperation(ListOps.asAny, {
    name: 'Cast List to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ListOps.asBoolean, {
    name: 'Cast List to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ListOps.asList, {
    name: 'Cast List to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ListOps.asDate, {
    name: 'Cast List to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ListOps.asMap, {
    name: 'Cast List to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ListOps.asNumber, {
    name: 'Cast List to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ListOps.asObject, {
    name: 'Cast List to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ListOps.asText, {
    name: 'Cast List to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ListOps.asTuple, {
    name: 'Cast List to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
  });

};
