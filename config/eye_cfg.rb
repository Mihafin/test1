Eye.config do
  logger '~/tmp/eye.log'
end

Eye.application 'test' do
  working_dir '/projects/cap/test1/current'
  env 'PORT' => '8080'

  group 'samples' do
    process :sample1 do
      pid_file 'log/1.pid' # pid_path will be expanded with the working_dir
      start_command 'nodejs ./server.js'

      # when no stop_command or stop_signals, default stop is [:TERM, 0.5, :KILL]
      # default `restart` command is `stop; start`

      daemonize true
      stdall 'log/sample1.log'

      # ensure the CPU is below 30% at least 3 out of the last 5 times checked
      check :memory, every: 20.seconds, below: 300.megabytes, times: 3
    end
  end
end

